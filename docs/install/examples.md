---
title: Простые примеры ботов
---

### Минимальный Callback
> Бот отвечает на любое сообщение

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;
$vk = vk::create(ТОКЕН, '5.120')->setConfirm(STR); //STR - строка подтверждения сервера
$vk->msg('Привет, ~!fn~')->send();
```
### Простой Callback

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;
$vk = vk::create(ТОКЕН, '5.120')->setConfirm(STR); //STR - строка подтверждения сервера
$vk->setUserLogError(ID); //ID - это id vk, кому бот будет отправлять все ошибки, возникние в скрипте
$data = $vk->initVars($peer_id, $user_id, $type, $message); //инициализация переменных из события
if($type == 'message_new') {
    if($message == 'Привет') {
        $vk->msg('Привет, ~!fn~')->send();
    }
}
```
### Простой LongPoll / User LongPoll
> Если указать токен группы - будет LongPoll.  
> Если указать токен пользователя - User LongPoll.  
> А еще можно указать логин и пароль от аккаунта:  
> `new LongPoll(ЛОГИН, ПАРОЛЬ, '5.120');`  
> Но советую создать токен вот по этому [гайду](https://vkhost.github.io/)

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\LongPoll;
$vk = LongPoll::create(ТОКЕН, '5.120');
$vk->setUserLogError(ID); //ID - это id vk, кому бот будет отправлять все ошибки, возникние в скрипте
$vk->listen(function () use ($vk) {
    $data = $vk->initVars($peer_id, $user_id, $type, $message); //инициализация переменных из события
    if($type == 'message_new') {
        if($message == 'Привет') {
            $vk->msg('Привет, ~!fn~')->send();
        }
    }
});
```
### Минимальный Бот на конструкторе (Callback)

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\Bot;
$bot = Bot::create(ТОКЕН, '5.120');
$bot->cmd('img', '!картинка')->img('cat.jpg')->text('Вот твой кот');
$bot->run(); //запускаем обработку события
```
### Минимальный Бот на конструкторе (LongPoll)

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\{Bot, LongPoll};
$vk = LongPoll::create(ТОКЕН, '5.120');
$bot = Bot::create($vk);
$bot->cmd('img', '!картинка')->img('cat.jpg')->text('Вот твой кот');
$vk->listen(function () use ($bot) {
    $bot->run(); //запускаем обработку события
});
```
### Бот с обработкой Команд на конструкторе (Callback)

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\{Bot, SimpleVK as vk};
$vk = vk::create(ТОКЕН, '5.120');
$vk->setUserLogError(ID); //ID - это id vk, кому бот будет отправлять все ошибки, возникшие в скрипте
$bot = Bot::create($vk);
//отправит картинку с текстом
$bot->cmd('img', '!картинка')->img('cat.jpg')->text('Вот твой кот');
//обработка команды с параметрами
$bot->cmd('sum', '!посчитай %n + %n')->func(function ($msg, $params) {
    $msg->text($params[0] + $params[1]);
});
//обработка команды по регулярке
$bot->preg_cmd('more_word', "!\!напиши (.*)!")->func(function ($msg, $params) {
    $msg->text("Ваше предложение: $params[1]");
});
$bot->run();
```
### Бот с обработкой Кнопок на конструкторе (Callback)

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\{Bot, SimpleVK as vk};
$vk = vk::create(ТОКЕН, '5.120');
$vk->setUserLogError(ID); //ID - это id vk, кому бот будет отправлять все ошибки, возникшие в скрипте
$bot = Bot::create($vk);
$bot->redirect('other', 'first'); //если пришла неизвестная кнопка/текст, то выполняем first
$bot->cmd('first')->kbd([['fish', 'cat']])->text('Выберите животное:'); //срабатывает при нажатии кнопки Начать
$bot->btn('fish', 'Рыбка')->text('Вы выбрали Рыбку!')->img('fish.jpg');
$bot->btn('cat', 'Котик')->text('Вы выбрали Котика!')->img('cat.jpg');
$bot->run();
```
### Бот на конструкторе, с использованием хранилища (Callback)

```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\{Bot, Store, SimpleVK as vk};
$vk = vk::create(ТОКЕН, '5.120');
$bot = Bot::create($vk);
$bot->cmd('cmd1', '!запомни %s')->text('Запомнил!')->func(function ($msg, $params) use ($vk) {
    $vk->initVars($id, $user_id, $payload, $user_id);
    $store = Store::load($user_id); //загружаем хранилище пользователя
    $store->sset('str', $params[0]); //записываем в ключ str его слово
});
$bot->cmd('cmd2', '!напомни')->func(function ($msg, $params) use ($vk) {
    $vk->initVars($id, $user_id, $payload, $user_id);
    $store = Store::load($user_id); //загружаем хранилище пользователя
    $str = $store->get('str'); //выгружаем из его хранилища строку
    $msg->text($str); //устанавливаем текст в экземпляре сообщения
});
$bot->run();
```
## Больше примеров
В папке [examples](https://github.com/digitalstars/simplevk/tree/testing/examples) лежат прокомментированные примеры более сложных ботов и функций, а также вы можете изучить функции с примерами использования в документации.