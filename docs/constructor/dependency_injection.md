---
title: Понимание внедрения зависимостей (DI)
sidebarDepth: 0
---
# Понимание внедрения зависимостей (DI)
При разработке бота вы неизбежно столкнетесь с необходимостью использовать внешние сервисы внутри ваших обработчиков команд и кнопок: подключение к базе данных, клиенты для сторонних API, системы логирования и многое другое.

Эта глава проведет вас по пути от самых простых, но опасных способов управления зависимостями до чистого, масштабируемого и профессионального подхода.

## Проблема: Нашему боту нужны данные
Давайте начнем с простой команды, которая показывает профиль пользователя. В первоначальной версии она возвращает статичные данные:
::: code-group
```php [Actions/ProfileCommand.php]
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
:::

**Новая задача**: `ProfileCommand` должен получать имя пользователя из базы данных. В качестве объекта базы используем обертку над PDO [digitalstars/DataBase](https://github.com/digitalstars/DataBase).

**Вопрос**: Как передать экземпляр подключения к БД внутрь нашего `ProfileCommand`?

## 🚫Антипаттерны
Рассмотрим подходы, которые кажутся простыми, но превращают код в кошмар сопровождения.

### Вариант №1: Ловушка global
::: info ИДЕЯ
Сделаю переменную глобальной — и все будет работать!
:::
::: code-group
```php [Actions/ProfileCommand.php]
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx): void
    {
        global $pdo; // [!code warning] 🔴 Красная тревога!

        $data = $pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```
```php [index.php]
use DigitalStars\DataBase\DB as PDO;
$pdo = new PDO("$db_type:host=$ip;dbname=$db_name", $login, $pass);

// ... настройка диспетчера ...
$dispatcher->handle();
```
:::

#### **Почему это проблема?**  
- ❌ Скрытая зависимость: Невозможно понять, откуда взялась переменная $pdo, не изучая весь контекст выполнения.
- ❌ Сложно тестировать: Вы не можете легко подменить реальное подключение к БД на тестовое (мок-объект).
- ❌ Нарушение архитектуры: противоречит SOLID, особенно инверсии зависимостей.
- ❌ Масштабируемость: Глобальные переменные — источник конфликтов имен и непредсказуемого поведения в больших проектах.
- ❌ Такой код невозможно переиспользовать в другом проекте без воссоздания глобального состояния.
- ❌ Загрязнение глобального пространства: Любой код может случайно перезаписать $pdo.
- ❌ Рефакторинг становится опасным.

### Вариант №2: Иллюзия контроля с Singleton
::: info ИДЕЯ
Singleton — это же паттерн проектирования! Использую его!
:::
::: code-group
```php [Actions/ProfileCommand.php]
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx): void
    {
        $pdo = Database::getInstance(); // [!code warning] 🟡 Выглядит лучше, но...
        $data = $pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```
```php [Services/Database.php]
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
:::
#### Почему это все еще плохо?
- ❌ Скрытая зависимость остается: `ProfileCommand` жестко связан с конкретным классом `Database`.
- ❌ Тестирование по-прежнему сложно
- ❌ Глобальное состояние в маскировке: `Singleton` — это просто красиво оформленная глобальная переменная.
- ❌ Все еще противоречит `SOLID`: Класс одновременно управляет своим жизненным циклом и выполняет бизнес-логику.
#### Но есть и плюсы
- ✅ Ленивая загрузка: объект создается только когда он нужен.
- ✅ Поддержка Singleton: объект создается только один раз.

::: warning ВЕРДИКТ
Singleton решает проблему "единственный экземпляр", но не решает проблему управления зависимостями.
:::

## ✅ Правильный путь: Инверсия контроля (IoC)
Прежде чем мы перейдем к коду, давайте разберемся с двумя ключевыми терминами: Инверсия контроля (IoC) и Внедрение зависимостей (DI).
::: tip IoC — это Принцип, DI — это Паттерн
- Инверсия контроля (IoC) — это архитектурный принцип, который переносит ответственность за создание и предоставление зависимостей из самого класса во внешнюю среду (контейнер или фреймворк). Контроль над созданием зависимостей инвертируется — он переходит от самого класса к его окружению.
- Внедрение зависимостей (DI) — это конкретный паттерн проектирования, который реализует принцип IoC. Это и есть тот самый процесс, когда фреймворк "внедряет" (передает) готовый объект-зависимость в ваш класс.

**Проще говоря: мы используем DI (паттерн), чтобы достичь IoC (принципа).**
:::
Наш `ProfileCommand` больше не будет сам искать или создавать `PDO`. Вместо этого он будет явно **объявлять** `PDO` как свою зависимость, а внешний механизм предоставит ему готовый экземпляр.
::: code-group
```php [Actions/ProfileCommand.php]
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
:::
Теперь наш класс чист: он зависит только от абстракции (PDO), а не от способа ее получения.

**Новый вопрос**: Кто создаст `ProfileCommand` и передаст ему `PDO`?

## Ручная фабрика
`EventDispatcher` позволяет указать функцию-фабрику, чтобы вручную контролировать создание экземпляров обработчиков:
::: code-group
```php [index.php]
//...
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
:::

Плюсы:
- ✅ Полный контроль над созданием объектов
- ✅ Явное объявление зависимостей
- ✅ Не требует сторонних библиотек
- ✅ Легко понять и отладить

Минусы:
- ❌ При изменении зависимостей класса нужно вручную править фабрику.
- ❌ Скрытые ошибки: Класс с зависимостями, забытый в match, сломается только во время выполнения.
- ❌ Отсутствие "ленивой" загрузки: Зависимости создаются сразу, даже если не будут использоваться.

::: tip ВЕРДИКТ
Отлично для небольших проектов и с малым количеством зависимостей.
:::

## DI-контейнер
Фабрика — это хорошо, но ее можно автоматизировать. Этим занимаются DI-контейнеры.
::: tip 💡DI-контейнер
Это "умная фабрика", которая автоматически разрешает зависимости. Она использует рефлексию для анализа конструкторов и методов, находит объявленные зависимости и рекурсивно создает их.
:::
Вам больше не нужно вручную прописывать создание каждого экземпляра класса. Вместо этого вы даете контейнеру "рецепты" для создания базовых сервисов, а все остальное он делает сам.

### Шаг 1: Настройка "рецептов" в контейнере
В качестве примера будем использовать популярный контейнер PHP-DI. В его конфигурации мы описываем, как создавать объекты, требующие особой настройки (например, подключение к БД из переменных окружения).
::: code-group
```php [config/container.php]
// Создание полного контейнера в следующей главе документации
$containerBuilder->addDefinitions([
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
```
:::

### Шаг 2: Интеграция с диспетчером
Наша фабрика становится невероятно простой: она просто делегирует создание объектов контейнеру.

::: code-group
```php [index.php]
$container = require_once __DIR__ . '/config/container.php';

$dispatcher = new EventDispatcher($vk, [
    'actions_paths' => [__DIR__ . '/Actions'],
    'root_namespace' => 'App',
    'factory' => fn(string $class) => $container->get($class), // [!code highlight]
]);

$dispatcher->handle();
```
:::

### Шаг 3: Запрос зависимости в классе
Наш `ProfileCommand` остается таким же чистым. Он не знает о существовании контейнера. Он просто объявляет зависимость от необходимых ему сервисов. Есть два основных способа это сделать:
### Способ 1: Внедрение через конструктор
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
### Способ 2: Внедрение в метод
Эта возможность фреймворка полезна, если зависимость нужна только для одного конкретного действия. `EventDispatcher` перед вызовом `handle` также попросит контейнер разрешить зависимости его аргументов.
```php
// Actions/ProfileCommand.php
#[Trigger(command: '/profile')]
class ProfileCommand extends BaseCommand
{
    public function handle(Context $ctx, PDO $pdo): void // [!code highlight]
    {
        $data = $pdo->row("SELECT name FROM users WHERE vk_id = ?i", [$ctx->userId]);
        $ctx->reply("Ваш профиль: {$data['name']}");
    }
}
```

И всё! Это работает автоматически для `ProfileCommand` и для **любого другого обработчика**, который объявит `PDO` как свою зависимость.

### Что происходит "под капотом"?
Рассмотрим пример с внедрением в конструктор:
1. В бота приходит сообщение `/profile`
2. `EventDispatcher` находит, что за эту команду отвечает класс `ProfileCommand`
3. `EventDispatcher` делегирует создание экземпляра `DI-контейнеру`.
4. `DI-контейнер` анализирует конструктор `ProfileCommand` и определяет его зависимость: `PDO`.
5. `DI-контейнер` создает и возвращает объект `PDO` по рецепту.
6. `DI-контейнер` создает `new ProfileCommand($pdo)` и возвращает готовый объект диспетчеру.
7. `EventDispatcher` вызывает метод `handle()` у полученного экземпляра `ProfileCommand`.

### Преимущества этого подхода:
- ✅ Автоматизация: создай рецепт один раз, а потом используй его везде.
- ✅ Ленивая загрузка: объект создается только когда он нужен.
- ✅ Поддержка Singleton: объект создается только один раз и сохраняется в контейнере.
- ✅ Соблюдение SOLID: Код становится слабосвязанным, что упрощает его поддержку и расширение.
- ✅ Централизованная конфигурация: Все "рецепты" для создания сервисов находятся в одном месте.
- ✅ Явное объявление зависимостей
- ✅ Легко тестировать: можно передать мок-объект в конструктор
- ✅ Гибкость: можно передать любую реализацию `PDO`






