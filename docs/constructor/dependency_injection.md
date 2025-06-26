---
title: Понимание внедрения зависимостей (DI)
sidebarDepth: 0
---
# Понимание внедрения зависимостей (DI)
При разработке бота вы неизбежно столкнетесь с необходимостью использовать внешние сервисы внутри ваших обработчиков команд и кнопок: подключение к базе данных, клиенты для сторонних API, системы логирования и многое другое.

Эта глава проведет вас по пути от самых простых, но опасных способов управления зависимостями до чистого, масштабируемого и профессионального подхода.

## Проблема: Нашему боту нужны данные
Давайте начнем с простой команды, которая показывает профиль пользователя. В первоначальной версии она возвращает статичные данные:
```php
// Actions/ProfileCommand.php
namespace App\Actions;

use DigitalStars\SimpleVK\EventDispatcher\Attributes\Trigger;
use DigitalStars\SimpleVK\EventDispatcher\BaseCommand;
use DigitalStars\SimpleVK\EventDispatcher\Context;

#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx): void
    {
        $ctx->reply("Ваш профиль: [ДАННЫЕ НЕ НАЙДЕНЫ]");
    }
}
```
**Новая задача**: `ProfileCommand` должен получать имя пользователя из базы данных. В качестве объекта базы используем обертку над PDO [digitalstars/DataBase](https://github.com/digitalstars/DataBase).

**Вопрос**: Как передать экземпляр подключения к БД внутрь нашего `ProfileCommand`?

## 🚫Антипаттерны
Рассмотрим подходы, которые кажутся простыми, но превращают код в кошмар сопровождения.

### Вариант №1: Ловушка global
::: info ИДЕЯ
Сделаю переменную глобальной — и все будет работать!
:::
```php
// index.php
use DigitalStars\DataBase\DB as PDO;
$pdo = new PDO("$db_type:host=$ip;dbname=$db_name", $login, $pass);

// ... настройка диспетчера ...
$dispatcher->handle();
```
```php
// Actions/ProfileCommand.php
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx): void
    {
        global $pdo; // [!code highlight] 🔴 Красная тревога!

        $data = $pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```
#### **Почему это проблема?**  
- ❌ Скрытая зависимость — не видно, откуда берётся $db, усложняет понимание кода.
- ❌ Сложно тестировать: Вы не можете легко подменить реальное подключение к БД на тестовое (мок-объект).
- ❌ Нарушает архитектуру — противоречит SOLID, особенно инверсии зависимостей.
- ❌ Сложно масштабировать — глобальные переменные вызывают конфликты в больших командах.
- ❌ Непереносимость — такой код не переиспользуешь без этой переменной.
- ❌ Загрязнение глобального пространства: Любой код может случайно перезаписать $pdo.
- ❌ Рефакторинг становится опасным.

### Вариант №2: Иллюзия контроля с Singleton
::: info ИДЕЯ
Singleton — это же паттерн проектирования! Использую его!
:::
```php
// Services/Database.php
class Database 
{
    private static ?PDO $instance = null;
    
    private function __construct() {} // Запрещаем создание через new
    
    public static function getInstance(): PDO 
    {
        if (self::$instance === null) {
            self::$instance = new PDO('mysql:host=localhost;dbname=test', 'user', 'pass');
        }
        return self::$instance;
    }
}
```
```php
// Actions/ProfileCommand.php
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx): void
    {
        $pdo = Database::getInstance(); // [!code highlight] 🟡 Выглядит лучше, но...
        $data = $pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```
#### Почему это все еще плохо?
- Скрытая зависимость остается: `ProfileCommand` жестко связан с конкретным классом `Database`.
- Тестирование по-прежнему сложно
- Глобальное состояние в маскировке: `Singleton` — это просто красиво оформленная глобальная переменная.
- Все еще противоречит `SOLID`: Класс одновременно управляет своим жизненным циклом и выполняет бизнес-логику.
::: warning ВЕРДИКТ
Singleton решает проблему "единственный экземпляр", но не решает проблему управления зависимостями.
:::

## ✅ Правильный путь: Инверсия контроля (IoC)
::: tip 💡ПРИНЦИП
Вместо того чтобы Action сам создавал или искал свои зависимости, мы передаем ему эти зависимости извне через конструктор.
:::
```php
// Actions/ProfileCommand.php
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function __construct(
        private readonly PDO $pdo // [!code highlight]
    ) {}

    public function handle(Context $ctx): void
    {
        $data = $this->pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```

**Новый вопрос**: Кто создаст `ProfileCommand` и передаст ему `PDO`?

## Ручная фабрика
`EventDispatcher` позволяет указать функцию-фабрику для создания экземпляров `Actions`:
```php
// index.php
$dispatcher = new EventDispatcher($vk, [
    'actions_paths' => [__DIR__ . '/Actions'],
    'root_namespace' => 'App',
    'factory' => static fn(string $class) => match ($class) {
        ProfileCommand::class => new ProfileCommand($pdo),
        StatsCommand::class => new StatsCommand($pdo),
        AdminCommand::class => new AdminCommand($pdo, $logger),
        //остальные классы без зависимостей
        default => new $class(),
    },
]);
```
Плюсы:
- ✅ Полный контроль над созданием объектов
- ✅ Явное объявление зависимостей
- ✅ Не требует сторонних библиотек
- ✅ Легко понять и отладить

Минусы:
- ❌ Редактирование фабрики в коде, а не конфиге
- ❌ При добавлении новой зависимости нужно редактировать и класс и фабрику
- ❌ Легко забыть добавить новый класс
- ❌ Невозможно реализовать ленивую загрузку. PDO инициализируется при любом запросе.

::: tip ВЕРДИКТ
Отлично для небольших проектов и с малым количеством зависимостей.
:::

## DI-контейнер
Фабрика — это хорошо, но ее можно автоматизировать. Этим занимаются DI-контейнеры.
::: tip 💡DI-контейнер
Это "умная фабрика", которая автоматически анализирует конструкторы и методы классов, находит зависимости и создает их рекурсивно.
:::
Вам больше не нужно вручную прописывать создание каждого класса. Вместо этого вы даете контейнеру "рецепты" для создания базовых сервисов, а все остальное он делает сам.

### Шаг 1: Настройка "рецептов" в контейнере
В конфигурации DI-контейнера мы описываем, как создавать объекты, требующие особой настройки (например, подключение к БД).
::: code-group
```php [config/container.php]
// Создание полного контейнера в следующей главе документации
$containerBuilder->addDefinitions([
    // Настройка подключения к БД
    PDO::class => function () {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', 
            getenv('DB_HOST'), 
            getenv('DB_NAME')
        );

        return new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    },
    // Здесь могут быть рецепты для других сервисов: логгера, HTTP-клиента и т.д.
]);
//...
```
:::
### Шаг 2: Запрос зависимости в классе
Наш класс `ProfileCommand` остается таким же чистым и не знает ничего о контейнере. Он просто просит `PDO` в `конструкторе` или `handle()`
::: code-group
```php [Конструктор]
// Actions/ProfileCommand.php
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function __construct(
        private readonly PDO $pdo [!code highlight]
    ) {}

    public function handle(Context $ctx): void
    {
        $data = $this->pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```
```php [handle()]
// Actions/ProfileCommand.php
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx, PDO $pdo): void // [!code highlight]
    {
        $data = $this->pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль:: {$data['name']}");
    }
}
```
:::
### Шаг 3: Интеграция с диспетчером
Наша фабрика становится невероятно простой: она просто делегирует создание объектов контейнеру.

```php
$container = require_once __DIR__ . '/config/container.php';

$dispatcher = new EventDispatcher($vk, [
    'actions_paths' => [__DIR__ . '/Actions'],
    'root_namespace' => 'App',
    'factory' => fn(string $class) => $container->get($class), // [!code highlight]
]);

$dispatcher->handle();
```
И всё! Это работает автоматически для `ProfileCommand` и для **любого другого Action**, который будет просить `PDO` в конструкторе.

### Что происходит "под капотом"?
На примере с конструктором:
1. В бота приходит сообщение `/profile`
2. `EventDispatcher` находит, что за эту команду отвечает класс `ProfileCommand`
3. `EventDispatcher` находит в конструкторе класса `PDO`
4. `DI-контейнер` создает и возвращает объект `PDO` по рецепту
5. `EventDispatcher` создает экземпляр `ProfileCommand`, передавая ему `PDO`
6. `EventDispatcher` вызывает метод `handle()` у полученного экземпляра.

### Ключевые преимущества этого подхода:
- ✅ Автоматизация: создай рецепт один раз, а потом используй его везде.
- ✅ Ленивая загрузка: объект создается только когда он нужен.
- ✅ Поддержка Singleton: объект создается только один раз и сохраняется в контейнере.
- ✅ Соблюдение SOLID принципов
- ✅ Полный контроль над созданием объектов
- ✅ Явное объявление зависимостей
- ✅ Легко тестировать: можно передать мок-объект в конструктор
- ✅ Гибкость: можно передать любую реализацию `PDO`
- ✅ Редактирование конфигурации в одном месте: `config/container.php`






