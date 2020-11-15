---
title: Подключение
---

# Подключение
## Используя composer
```
composer require digitalstars/simplevk
```
```php
require_once "vendor/autoload.php";
```
## Вручную
1. Скачать последний релиз c [github](https://github.com/digitalstars/simplevk)
2. Подключить `autoload.php`. Вот так будет происходить подключение, если ваш скрипт находится в той же папке, что и папка `simplevk-master`
```php
require_once "simplevk-master/autoload.php";
```
## Подключение классов  
Через конструкцию use подключите те классы, методы которых вы будете использовать.
```php
use DigitalStars\SimpleVK\Auth;
use DigitalStars\SimpleVK\Message;
use DigitalStars\SimpleVK\SimpleVK;
use DigitalStars\SimpleVK\Auth;
use DigitalStars\SimpleVK\LongPoll;
use DigitalStars\SimpleVK\Streaming;
use DigitalStars\SimpleVK\Bot;
```