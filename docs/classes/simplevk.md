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
### Используя токен пользователя или сообщества  
#### Параметры метода

|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**token\***  | `string`          |Токен пользователя или сообщества|
|2  |**version\***  | `string`             |Версия VK API|

```php
$vk = vk::create(ТОКЕН, '5.126');
```
### Используя логин и пароль от аккаунта ВК  
#### Параметры метода
|#  |    Тип          |    Описание             |
|:-:|:--------------: |-------------          |
|1  | `string`          |Логин от аккаунта|
|2  | `string`             |Пароль от аккаунта|
|3  | `int`             |Версия VK API             |

```php
$vk = vk::create('88005553535', 'my_password', '5.126');
```
### Используя экземпляр класса Auth  
#### Параметры метода
|#  |    Тип          |    Описание             |
|:-:|:--------------: |-------------          |
|1  | `Auth object`          |Экземпляр класса Auth|

```php
use DigitalStars\SimpleVK\Auth;
$auth = Auth::create(ВАШ_СПОСОБ_АВТОРИЗАЦИИ);
$vk = vk::create($auth);
```

## setConfirm
Используется для отправки строки, которую должен вернуть сервер при подтверждении Callback сервера в настройках сообщества
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**str\***  | `string`          | Строка подтверждения сервера   |
### Возвращает
`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования
```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126')->setConfirm('6628bb69');
```

## setSecret
Используется для установки `секретного ключа`, заданного вами в настройках Callback сервера сообщества. Метод автоматически проверяет, прислал ли ВК в событии эту строку. Если строка не сойдется или будет отсутствовать, то метод завершит работу скрипта с текстом `security error`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**str\***  | `string`          | Секретный ключ   |
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
Метод принимает переменные по ссылке и записывает в них определенные значения из пришедшего от ВК события, если они доступны. Если данные не пришли, то в переменные будет передан null
### Параметры метода
|#  |Название  |    Тип          |    Будет передано значение             |
|:-:|-|:--------------: |-------------          |
|1  |&id  | `int`         | `$data['object']['peer_id']`|
|1  |&user_id  | `int`         | `$data['object']['from_id']` или `$data['object']['user_id']` |
|1  |&type   | `string`         | `$data['type']`. Название пришедшего события  |
|1  |&message   | `string`         | `$data['object']['text']`  |
|1  |&payload   | `array`         | `$data['object']['payload']` |
|1  |&msg_id   | `int`         | `$data['id']`  |
|1  |&attachments   | `array`         | Сформированный массив вложений, разбитый по категориям   |
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
* У метода нет привязки к событиям. Например, если в пришедшем событии есть поле `$data['object']['text']`, то оно будет записано в соответствующую переменную, чтобы оно не значило
* В скором времени с помощью этого метода можно будет работать с данными из user longpoll

## initPeerID
Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['peer_id']` из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**id\***  | `int`          | peer_id   |
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
Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['text']` из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**text\***  | `string`          | text   |
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
Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['payload']` в виде массива из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**payload\***  | `array`          | payload   |
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
Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['from_id']` или `$data['object']['user_id']` в виде массива из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**user_id\***  | `int`          | user_id   |
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
Метод принимает переменную по ссылке и записывает в нее значение `$data['type']` в виде массива из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**type\***  | `string`          | Название события   |
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
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**data\***  | `array`          | Данные события   |
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
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |&keyboard  | `bool`          |  поддерживается ли клавиатура ботов клиентом   |
|2  |&inline_keyboard  | `bool`          |  поддерживается ли inline-клавиатура ботов клиентом   |
|2  |&carousel  | `bool`          |  поддерживаются ли карусели клиентом   |
|3  |&button_actions  | `array`          |  массив кнопок, которые поддерживает клиент   |
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

## group
Метод нужен для вызова методов ВК от лица сообщества, в котором текущий пользователь является админом. Используется, когда у вас нет токена от сообщества, но нужно выполнить какой-то действие в сообществе от вашего лица.
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |id  | `string`          | id группы. Положительное число   |
### Возвращает
`$this` - экземпляр класса, который вызвал этот метод

### Примеры использования
```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ЛОГИН, ПАРОЛЬ, '5.126')->group(3344678);
$vk->sendMessage(123456, 'Пишу от лица группы!');
```

## json_online
Получить ссылку на отображение переданного массива/json в виде json дерева на сайте <https://jsoneditoronline.org/>. Удобно использовать при дебаге больших массивов.  
> Если не передавать в метод данные, то по умолчанию будет сформирована ссылка с данными события пришедшего от ВК.
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |data  | `json`\|`array`          | Массив или json   |
### Возвращает
Ссылку на <https://jsoneditoronline.org/> с данными

### Примеры использования
```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$url = $vk->json_online();
$vk->reply("Визуализация данных этого события: $url");
$url2 = $vk->json_online([1,2,3 => '4']);
$vk->reply("Визуализация массива: $url2");
```


## request
Используется для вызова любого метода VK API, который есть в документации ВК
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**method\***  | `string`          | Название метода   |
|2  |params  | `array`          | Ассоциативный массив параметров   |
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
Также есть укороченная версия `request`. Чтобы использовать ее, вы должны вызвать название метода от экземпляра класса ВК с заменой `.` на `_`. В этом режиме метод принимает только один параметр - `params`
```php
$vk->messages_send(['message' => 'Привет', 'user_id' => 89846036]);
```


## userInfo
Обертка над `users.get`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |user_url  | `string`\|`int`          | Ссылка на пользователя в любом виде или user_id   |
|1  |scope   | `array`          | Ассоциативный массив доп. параметров для users.get  |
### Возвращает
Первый элемент массива `response` из результата выполнения `users.get`

### Примеры использования
```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->userInfo('https://vk.com/durov');
//или
$info = $vk->userInfo(1, ['fields' => 'sex']);
print_r($info);
/*[
'first_name' => 'Павел',
'id' => 1,
'last_name' => 'Дуров',
'can_access_closed' => true,
'is_closed' => false,
'sex' => 2
]*/
```


## groupInfo
Обертка над `groups.getById`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |group_url  | `string`\|`int`          | id или короткие имена сообществ, можно ссылкой |
### Возвращает
Первый элемент массива `response` из результата выполнения `groups.getById`

### Примеры использования
```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->groupInfo('https://vk.com/tower_of_destiny');
//или
$info = $vk->groupInfo(193655066);
print_r($info);
/*[
"id" => 193655066,
"name" => "Башня судьбы",
"screen_name" => "tower_of_destiny",
"is_closed" => 0,
... etc.
]*/
```

## setProxy
## sendWallComment
## placeholders
Делает алиас используя `id` того, от кого пришло событие, либо подставив необходимый `id`
Это работает как с пользователями, так и с сообществами.  
> Если сообщество, то любой плейсхолдер будет заменен на полное название сообщества с упоминанием или без
### Возможные варианты:
`~fn~` - Имя  
`~!fn~` - Имя в виде упоминания `[id|Имя]`  
`~ln~` - Фамилия  
`~!ln~` - Фамилия в виде упоминания `[id|Фамилия]`  
`~full~` - Имя Фамилия  
`~!full~` - Имя Фамилия в виде упоминания `[id|Имя Фамилия]`  

Можно явно указать через черту какой `id` необходимо использовать:  
`~!full|418618~` - `[id418618|Имя Фамилия]`

Также можно давать свое название для упоминания:  
> В таком случае не нужно указывать `!`  
`~Мое сообщество|-418619~` - заменит на `[club418619|Мое сообщество]`  
`~Мой друг|418618~` - заменит на `[id418618|Мой друг]`  

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->msg('Привет ~full~')->send(); //Привет Имя Фамилия
$vk->msg('Привет ~!full~')->send(); //Привет [id|Имя Фамилия]
```

## group
## responseGeneratorRequest
## generatorRequest
## getAllWalls
Получить все посты

### Параметры метода

|# |Название | Тип | Описание | 
|:-:|:-:|:--------------: |------------- | 
|1 |**id\***  | `int`          | int |

### Возвращает

`Generator`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
foreach ($vk->getAllWalls(1) as $post) {
    print_r($post);
}
```
## getAllGroupsFromUser
## getAllMembers
## getAllComments
## getAllDialogs
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

|# |Название | Тип | Описание | 
|:-:|:-:|:--------------: |------------- | 
|1 |**id\***  | `int`          | user_id Пользователя |

### Возвращает

Дата и время регистрации пользователя в формате `20:27:12 23.09.2006`

### Примеры использования

```php
<?php
require_once "vendor/autoload.php";
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->dateRegistration(1); //"20:27:12 23.09.2006"
```
## sendWallComment
## eventAnswerEditKeyboard
## eventAnswerOpenApp
## eventAnswerOpenLink
## eventAnswerSnackbar
## sendAllChats
## sendAllDialogs

## isAdmin

Является ли участник администратором беседы

### Параметры метода

|# |Название | Тип | Описание | 
|:-:|:-:|:--------------: |------------- | 
|1 |**peer_id\***  | `int`          | id беседы|
|2 |**user_id\***  | `int`          | id пользователя|

### Возвращает

`string` owner - создатель, admin - администратор\
`false` обычный пользователь\
`null` пользователя нет в беседе\
`Expection` нет доступа к информации, возможно:  
* бот не является администратором  
* неправильный id беседы  
* бота нет в беседе  

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
> Т.к. `owner` и `admin` это текст, то они являются `true`. Поэтому можно использовать так:
```php 
if($vk->isAdmin($peer_id, $user_id))
```
## setProxy
