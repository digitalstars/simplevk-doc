---
title: ООП-конструктор ботов
sidebarDepth: 0
---

# Компонентный конструктор ботов  
*Современный ООП-подход на основе атрибутов и Event Dispatcher*


Данный подход основан на атрибутах PHP 8 и компонентной архитектуре. Команды и кнопки объявляются в виде отдельных классов, а диспетчер автоматически направляет события соответствующим обработчикам, ориентируясь на `text` или `payload` входящего события.

Это позволяет создавать сложных, хорошо структурированных и легко поддерживаемых ботов, собирая их из независимых объектно-ориентированных компонентов.

**Идеально подходит для:**
- **Крупных и долгосрочных проектов:** Легко добавлять новую функциональность, не ломая старую.
- **Чистого кода:** Обеспечивает четкое разделение ответственности.
- **Тестирования:** Каждый компонент можно тестировать в изоляции.
- **Командной разработки:** Разные разработчики могут параллельно работать над разными компонентами.

## Простой пример использования
```php
// Файл: /Action/StatusButton.php
<?php
namespace App\Action;
use DigitalStars\SimpleVK\Attributes\{AsButton, Trigger};
use DigitalStars\SimpleVK\EventDispatcher\{Context, BaseButton};

#[AsButton(label: 'Статус', color: 'green')]
#[Trigger(command: '/status')]
class StatusButton extends BaseButton {
	//Сработает при нажатии на кнопку или на /status
    public function handle(Context $ctx, ...$args): void {
        $ctx->vk->reply('Бот онлайн! ✅');
    }
}
```


```php
// Файл: /Action/MainMenuCommand.php
<?php
namespace App\Action;
use App\Action\StatusButton; // <-- Импортируем нашу кнопку
use DigitalStars\SimpleVK\Attributes\Trigger;
use DigitalStars\SimpleVK\EventDispatcher\{Context, BaseCommand};

#[Trigger(command: '/start')]
#[Trigger(command: '/menu')]
class MainMenuCommand extends BaseCommand {
	//Сработает на /menu или /start
    public function handle(Context $ctx, ...$args): void {
	    $btn = new StatusButton();
        $ctx->vk->msg('Главное меню')->kbd($btn, inline: true)->send();
    }
}
```


```php
// Файл: bot.php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use DigitalStars\SimpleVK\SimpleVK;
use DigitalStars\SimpleVK\EventDispatcher\EventDispatcher;

$vk = SimpleVK::create("ТОКЕН", "5.199");

// 3. Создание и конфигурация Диспетчера
$dispatcher = new EventDispatcher($vk, [
    // Указываем корневой namespace для автозагрузки классов
    'root_namespace' => 'App',
    // Указываем путь к папке с нашими Action-компонентами
    'actions_paths' => [
        __DIR__ . '/Action',
    ],
]);

$dispatcher->handle();
```


*Файл: composer.json*
```json
"autoload": {
  "psr-4": {
    "App\\": "./"
  }
}
```

```bash
composer dump-autoload -o
```