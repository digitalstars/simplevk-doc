---
title: SimpleVK
---

## Подключение

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;
```

## create

С помощью метода `create` можно получить авторизацию для работы с ВК.  
Есть три типа авторизации:

### Используя токен аккаунта или сообщества

#### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**token\***  | `string`          |Токен
пользователя или сообщества| |2 |**version\***  | `string`             |Версия VK API|

```php
$vk = vk::create(ТОКЕН, '5.126');
```

### Используя логин и пароль от аккаунта ВК

#### Параметры метода

|# | Тип | Описание | |:-:|:--------------: |------------- | |1 | `string`          |Логин от аккаунта| |2 | `string`
|Пароль от аккаунта| |3 | `int`             |Версия VK API |

```php
$vk = vk::create('88005553535', 'my_password', '5.126');
```

### Используя экземпляр класса Auth

#### Параметры метода

|# | Тип | Описание | |:-:|:--------------: |------------- | |1 | `Auth object`          |Экземпляр класса Auth|

```php
use DigitalStars\SimpleVK\Auth;
$auth = Auth::create(ВАШ_СПОСОБ_АВТОРИЗАЦИИ);
$vk = vk::create($auth);
```

## setConfirm

Используется для отправки строки, которую должен вернуть сервер при подтверждении Callback сервера в настройках
сообщества

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**str\***  | `string`          | Строка
подтверждения сервера |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->request('messages.send', ['message' => 'Привет', 'user_id' => 89846036]);
```

## setSecret

Используется для установки `секретного ключа`, заданного вами в настройках Callback сервера сообщества. Метод
автоматически проверяет, прислал ли ВК в событии эту строку. Если строка не сойдется или будет отсутствовать, то метод
завершит работу скрипта с текстом `security error`

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**str\***  | `string`          |
Секретный ключ |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126')->setSecret('my_secret_str')->setConfirm('6628bb69');
```

## initVars

Метод принимает переменные по ссылке и записывает в них определенные значения из пришедшего от ВК события, если они
доступны. Если данные не пришли, то в переменные будет передан null

### Параметры метода

|# |Название | Тип | Будет передано значение | |:-:|-|:--------------: |------------- | |1 |&id | `int`
| `$data['object']['peer_id']`| |1 |&user_id | `int`         | `$data['object']['from_id']`
или `$data['object']['user_id']` | |1 |&type | `string`         | `$data['type']`. Название пришедшего события | |1
|&message | `string`         | `$data['object']['text']`  | |1 |&payload | `array`
| `$data['object']['payload']` | |1 |&msg_id | `int`         | `$data['id']`  | |1 |&attachments | `array`         |
Сформированный массив вложений, разбитый по категориям |

### Возвращает

Массив с данными пришедшего события

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
//в $data хранится все данные события
$data = $vk->initVars($peer_id, $user_id, $type, $message, $payload, $msg_id, $attachments);
if($type == 'message_new') { //проверяем тип события
    $vk->reply("Твой user_id - ".$user_id);
}
```

### Дополнительные возможности и их разбор

* Вы можете менять названия переменных, но нельзя менять их порядок
* Вы можете использовать не все переменные, а только несколько первых:

```php
$vk->initVars($id, $user_id, $type, $message);
```

* Если какие-то переменные не используются, их можно заменить на `null` для большей читаемости кода:

 ```php
 $vk->initVars($id, null, null, $message);
 ```

* У метода нет привязки к событиям. Например, если в пришедшем событии есть поле `$data['object']['text']`, то оно будет
  записано в соответствующую переменную, чтобы оно не значило
* В скором времени с помощью этого метода можно будет работать с данными из user longpoll

## initPeerID

Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['peer_id']` из пришедшего события,
если такое поле есть. Если нет, то записывает `null`

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initPeerID($id);
```

Также можно использовать цепочку вызовов

```php
$vk = vk::create(ТОКЕН, '5.126')->initPeerID($id);
```

## initText

Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['text']` из пришедшего события, если
такое поле есть. Если нет, то записывает `null`

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**text\***  | `string`          | text |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initText($text);
```

Также можно использовать цепочку вызовов

```php
$vk = vk::create(ТОКЕН, '5.126')->initText($text);
```

## initPayload

Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['payload']` в виде массива из
пришедшего события, если такое поле есть. Если нет, то записывает `null`

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**payload\***  | `array`          |
payload |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initPayload($payload);
```

Также можно использовать цепочку вызовов

```php
$vk = vk::create(ТОКЕН, '5.126')->initPayload($payload);
```

## initUserID

Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['from_id']`
или `$data['object']['user_id']` в виде массива из пришедшего события, если такое поле есть. Если нет, то
записывает `null`

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**user_id\***  | `int`          | user_id
|

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initUserID($user_id);
```

Также можно использовать цепочку вызовов

```php
$vk = vk::create(ТОКЕН, '5.126')->initUserID($user_id);
```

## initType

Метод принимает переменную по ссылке и записывает в нее значение `$data['type']` в виде массива из пришедшего события,
если такое поле есть. Если нет, то записывает `null`

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**type\***  | `string`          |
Название события |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initType($type);
```

Также можно использовать цепочку вызовов

```php
$vk = vk::create(ТОКЕН, '5.126')->initType($type);
```

## initData

Метод принимает переменную по ссылке и записывает в нее массив данных пришедшего события

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**data\***  | `array`          | Данные
события |

### Возвращает

`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initData($data);
```

Также можно использовать цепочку вызовов

```php
$vk = vk::create(ТОКЕН, '5.126')->initData($data);
```

## getAttachments

### Возвращает

Сформированный массив вложений из события, разбитый по категориям

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$attachments = $vk->getAttachments();
//добавить сюда пример
```

## clientSupport

Метод принимает переменные по ссылке и записывает в нее данные о поддержке возможностей клиента

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |&keyboard | `bool`          |
поддерживается ли клавиатура ботов клиентом | |2 |&inline_keyboard | `bool`          | поддерживается ли
inline-клавиатура ботов клиентом | |2 |&carousel | `bool`          | поддерживаются ли карусели клиентом | |3
|&button_actions | `array`          | массив кнопок, которые поддерживает клиент |

### Возвращает

Массив `$data['object']['client_info']`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$support = $vk->clientSupport($keyboard, $inline, $carousel, $buttons);
if($keyboard) {
    //клавиатура поддерживается
}
```

### Дополнительные возможности и их разбор

* Вы можете менять названия переменных, но нельзя менять их порядок
* Вы можете использовать не все переменные, а только несколько первых:

```php
$vk->clientSupport($keyboard, $inline);
```

* Если какие-то переменные не используются, их можно заменить на `null` для большей читаемости кода:

 ```php
$vk->clientSupport($keyboard, null, null, $buttons);
 ```

## request

Используется для вызова любого метода VK API, который есть в документации ВК

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**method\***  | `string`          |
Название метода | |2 |params | `array`          | Ассоциативный массив параметров |

### Возвращает

Массив `response` с результатом выполнения метода ВК в случае успешного выполнения и `Exception` в случае ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->request('messages.send', ['message' => 'Привет', 'user_id' => 89846036]);
```

Также есть укороченная версия `request`. Чтобы использовать ее, вы должны вызвать название метода от экземпляра класса
ВК с заменой `.` на `_`. В этом режиме метод принимает только один параметр - `params`

```php
$vk->messages_send(['message' => 'Привет', 'user_id' => 89846036]);
```

## reply

Отправляет сообщение тому, от кого пришло событие

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**message\***  | `string`          |
Текст сообщения | |2 |params | `array`          | Ассоциативный массив параметров для messages.send |

### Возвращает

Массив `response` с результатом выполнения метода ВК messages.send в случае успешного выполнения и `Exception` в случае
ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id, null, null, null, null, $msg_id);
$vk->reply('Это мое сообщение');
$vk->reply('Вот твое сообщение!', ['forward_messages' => $msg_id]);
```

## sendMessage

Отправляет сообщение указанному peer_id

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id
получателя | |2 |**message\***  | `string`          | Текст сообщения | |3 |params | `array`          | Ассоциативный
массив параметров для messages.send |

### Возвращает

Массив `response` с результатом выполнения метода ВК messages.send в случае успешного выполнения и `Exception` в случае
ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id, null, null, null, null, $msg_id);
$vk->sendMessage($id, 'Это мое сообщение');
$vk->sendMessage($id, 'Вот твое сообщение!', ['forward_messages' => $msg_id]);
```

## forward

Пересылает id сообщений указанному peer_id

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id
получателя | |2 |**id_messages\***  | `int`\|`array`          | Массив с id сообщений или id сообщения | |3 |params
| `array`          | Ассоциативный массив параметров для messages.send |

### Возвращает

Массив `response` с результатом выполнения метода ВК messages.send в случае успешного выполнения и `Exception` в случае
ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id, null, null, null, null, $msg_id);
$vk->forward($id, $msg_id, ['message' => 'Вот твое сообщение!']);
```

## sendImage

Отправляет изображение/я указанному peer_id

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id
получателя | |2 |**local_file_paths\***  | `string`\|`array`          | путь до изображения или массив путей | |3
|params | `array`          | Ассоциативный массив параметров для messages.send |

### Возвращает

Массив `response` с результатом выполнения метода ВК messages.send в случае успешного выполнения и `Exception` в случае
ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id);
$vk->sendImage($id, '../cat.png', ['message' => 'Вот тебе котики!']);
$vk->sendImage($id, ['../cat2.png', '../cat3.png']);
```

## sendDoc

Отправляет файл/ы как документ/ы указанному peer_id

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id
получателя | |2 |**local_file_paths\***  | `string`\|`array`          | путь до файла или массив путей | |3 |params
| `array`          | Ассоциативный массив параметров для messages.send |

### Возвращает

Массив `response` с результатом выполнения метода ВК messages.send в случае успешного выполнения и `Exception` в случае
ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id);
$vk->sendDoc($id, '../cat.png', ['message' => 'Вот тебе котики!']);
$vk->sendDoc($id, ['../cat2.png', '../cat3.png']);
```

## sendVoice

Отправляет звуковой файл как голосовое сообщение указанному peer_id

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id
получателя | |2 |**local_file_path\***  | `string`          | путь до файла или массив путей | |3 |params | `array`
| Ассоциативный массив параметров для messages.send |

### Возвращает

Массив `response` с результатом выполнения метода ВК messages.send в случае успешного выполнения и `Exception` в случае
ошибки

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id);
$vk->sendVoice($id, 'voice.mp3');
```

### Памятка по работе с голосовыми сообщениями

todo: заполнить позже

## Placeholders

Создаёт алиас на `id` пользователя

Восклицательный знак в начале — пользователь будет упомянут

### Возможные варианты:

`~fn~` - упоминание пользователя по имени\
`~ln~` - упоминание пользователя по фамилии\
`~full~` - упоминание пользователя по имени и фамилии\

Можно явно указать через черту на какой `id` необходим плейсхолдер:\
`~full|418618~`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($id);
$vk->msg('Привет ~fn~')->send(); //Привет Имя
$vk->msg('Привет ~ln~')->send(); //Привет Фамилия
$vk->msg('Привет ~full~')->send(); //Привет Имя Фамилия

//Будет упоминание
$vk->msg('Привет ~fn~')->send(); //Привет [id|Имя]
$vk->msg('Привет ~ln~')->send(); //Привет [id|Фамилия]
$vk->msg('Привет ~full~')->send(); //Привет [id|Имя Фамилия]
```

## group

## responseGeneratorRequest

## generatorRequest

## getAllWalls
Получить все посты

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | int |

### Возвращает

`Generator`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
foreach ($bot->getAllWalls(1) as $post) {
print_r($post);
}
```
## getAllGroupsFromUser

## getAllMembers

## getAllComments

## getAllDialogs

## groupInfo
Получить дату регистрации

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | int |

### Возвращает

`array`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->groupInfo(1); //"20:27:12 23.09.2006"
```

## json_online

## generateCarousel

## generateKeyboard

## buttonCallback

## buttonText

## buttonApp

## buttonDonateToUser

## buttonDonateToGroup

## buttonPayToUser

## buttonPayToGroup

## buttonOpenLink

## buttonLocation

## sendCarousel

## sendKeyboard

## dateRegistration

Получить дату регистрации

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | int |

### Возвращает

`string`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->dateRegistration(1); //"20:27:12 23.09.2006"
```

## sendWallComment

## userInfo

## eventAnswerEditKeyboard

## eventAnswerOpenApp

## eventAnswerOpenLink

## eventAnswerSnackbar

## sendAllChats

## sendAllDialogs

## isAdmin

Является ли участник администратором беседы

### Параметры метода

|# |Название | Тип | Описание | |:-:|:-:|:--------------: |------------- | |1 |**id\***  | `int`          | peer_id id
беседы|

### Возвращает

`string` owner - создатель, admin - администратор\
`false` обычный пользователь\
`null` пользователя нет в беседе\
`Expection` нет доступа к информации, возможно:\
бот не является администратором, неправильный id беседы, бота нет в беседе

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initVars($peer_id, $user_id);
try {
    $vk->isAdmin($user_id, $peer_id);
} catch (SimpleVkException $e) {
    die($e->getMessage());
}
```

## setProxy