---
title: Подключение
---

# Подключение
## Используя composer
1\. Установка в *Unix
```
composer require digitalstars/simplevk:dev-testing
```
1\. Установка в Windows
> В Windows нет 2х модулей, из-за которых не работает многопоточность. Поэтому ставим с игнорированием зависимостей
```
composer require digitalstars/simplevk:dev-testing --ignore-platform-reqs
```
2\. Подключить `autoload.php` напрямую внутри бота
```php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
```
## Вручную
1. Скачать последний релиз c [github](https://github.com/digitalstars/simplevk/tree/testing)
2. Подключить `autoload.php`.
> Вот так будет происходить подключение, если ваш бот находится в той же папке, что и папка `simplevk-testing`
```php
require_once "simplevk-testing/autoload.php";
```

## Подключение классов  
Через конструкцию `use` подключите те классы, методы которых вы будете использовать.
```php
use DigitalStars\SimpleVK\Auth;
use DigitalStars\SimpleVK\Message;
use DigitalStars\SimpleVK\SimpleVK;
use DigitalStars\SimpleVK\Auth;
use DigitalStars\SimpleVK\LongPoll;
use DigitalStars\SimpleVK\Streaming;
use DigitalStars\SimpleVK\Bot;
```