---
title: SimpleVK
---

## Подключение
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126')->setSecret('my_secret_str')->setConfirm('6628bb69');
```



## initVars
Метод принимает переменные по ссылке и записывает в них определенные значения из пришедшего от ВК события, если они доступны. Если данные не пришли, то в переменные будет передан `null`
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
//в $data хранится все данные события
$data = $vk->initVars($peer_id, $user_id, $type, $message, $payload, $msg_id, $attachments);
if($type == 'message_new') { //проверяем тип события
    $vk->msg("Твой user_id - ".$user_id)->send();
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initData($data);
```
Также можно использовать цепочку вызовов
```php
$vk = vk::create(ТОКЕН, '5.126')->initData($data);
```



## initMsgID
Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['id']` в виде массива из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**mid\***  | `int`          | ID сообщения   |
### Возвращает
`$this` - экземпляр класса, который вызвал этот метод
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initMsgID($mid);
```
Также можно использовать цепочку вызовов
```php
$vk = vk::create(ТОКЕН, '5.126')->initMsgID($mid);
```



## initConversationMsgID
Метод принимает переменную по ссылке и записывает в нее значение `$data['object']['conversation_message_id']` в виде массива из пришедшего события, если такое поле есть. Если нет, то записывает `null`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**cmid\***  | `int`          | conversation_message_id   |
### Возвращает
`$this` - экземпляр класса, который вызвал этот метод
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->initConversationMsgID($cmid);
```
Также можно использовать цепочку вызовов
```php
$vk = vk::create(ТОКЕН, '5.126')->initConversationMsgID($cmid);
```



## getAttachments
### Возвращает
Сформированный массив вложений из события, разбитый по категориям
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
|2  |&inline  | `bool`          |  поддерживается ли inline-клавиатура ботов клиентом   |
|2  |&carousel  | `bool`          |  поддерживаются ли [карусели](https://vk.com/dev/bot_docs_templates?f=5.1.+%D0%9A%D0%B0%D1%80%D1%83%D1%81%D0%B5%D0%BB%D0%B8) клиентом   |
|3  |&button_actions  | `array`          |  массив кнопок, которые поддерживает клиент   |
|3  |&lang_id  | `int`          |   [id](https://vk.com/dev/api_requests?f=2.+%CE%E1%F9%E8%E5+%EF%E0%F0%E0%EC%E5%F2%F0%FB) используемого языка   |
### Возвращает
Массив `$data['object']['client_info']`
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$support = $vk->clientSupport($keyboard, $inline, $carousel, $button_actions, $lang_id);
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->request('messages.send', ['message' => 'Привет', 'user_id' => 89846036]);
```
Также есть укороченная версия `request`. Чтобы использовать ее, вы должны вызвать название метода от экземпляра класса ВК с заменой `.` на `_`. В этом режиме метод принимает только один параметр - `params`
```php
$vk->messages_send(['message' => 'Привет', 'user_id' => 89846036]);
```


## userInfo
Возвращает информацию о пользователе. Обертка над [users.get](https://vk.com/dev/users.get)
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |users_url  | `string`\|`int`\|`array`          | Ссылка на пользователя в любом виде или `user_id` или массив пользователей в виде `user_id` или ссылок|
|2  |fields   | `array`\|`string`       | Одно или несколько дополнительных полей в виде массива или строки |
|3  |name_case   | `string`       | Падеж для склонения имени и фамилии пользователя |
### Возвращает
Первый элемент массива `response` из результата выполнения `users.get`, если информация запрашивалась по одному пользователю. Иначе возвращает несколько массивов с данными.
  
Если вызвать без параметров с токеном пользователя, то метод вернет информацию о текущем аккаунте.
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->userInfo('https://vk.com/durov');
$vk->userInfo(['https://vk.com/durov', 2, 3]);
//или
$info = $vk->userInfo(1, 'sex', 'dat');
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
Возвращает информацию о группах. Обертка над [groups.getById](https://vk.com/dev/groups.getById)
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  | group_url  | `string`\|`int`\|`array`          | Ссылка на сообщество в любом виде или `group_id`|
|2  | fields  | `array`\|`string`          | Одно или несколько дополнительных полей в виде массива или строки |
### Возвращает
Первый элемент массива `response` из результата выполнения `groups.getById`, если информация запрашивалась по одному сообществу. Иначе возвращает несколько массивов с данными.

Если вызвать без параметров с токеном сообщества, то метод вернет информацию о текущем сообществе.
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->groupInfo('https://vk.com/tower_of_destiny');
$vk->groupInfo(['https://vk.com/tower_of_destiny', 1234], 'description');
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
Установка проксирования трафика через `socks4`/`socks5`
### Параметры метода
|#  |Название  |    Тип          |    Описание             |
|:-:|:-:|:--------------: |-------------          |
|1  |**proxy\***  | `string`          | Адрес прокси-сервера   |
|2  |pass  | `string`          | Пароль, если есть   |
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

vk::setProxy("socks4://149.56.1.48:8181");
$vk = vk::create(ТОКЕН, '5.126');
```



## placeholders
Делает алиас используя `id` того, от кого пришло событие, либо подставив необходимый `id`.  
Это работает как с пользователями, так и с сообществами.  
> Если событие от сообщества, то любой плейсхолдер будет заменен на полное название сообщества с упоминанием или без
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$vk->msg('Привет ~full~')->send(); //Привет Имя Фамилия
$vk->msg('Привет ~!full~')->send(); //Привет [id|Имя Фамилия]
```



## generatorRequest
Универсальный генератор запросов для всех методов, в которых есть `count` и `offset`. Автоматически смещает `offset`, пока не получит все `items`
### Параметры метода
|# |Название | Тип | Описание |
|:-:|:-:|:--------------: |------------- |
|1 |**method\***  | `string`          | Метод из vk api |
|2 |params  | `array`          | Параметры для метода |
|3 |count  | `int`          | Количество `items` за раз. По умолчанию 200 |
### Возвращает
`Generator`
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$generator = $vk->generatorRequest('groups.getMembers', ['group_id' => 1]);
foreach ($generator as $member) {
    print $member; //id одного участника
}
```



## getAllWalls
Получить все посты со стены сообщества или пользователя. Готовый генератор с оберткой над [wall.get](https://vk.com/dev/wall.get)
### Параметры метода
|# |Название | Тип | Описание | 
|:-:|:-:|:--------------: |------------- | 
|1 |id | `int`          | peer_id |
|2 |extended | `bool`          | Возвращать ли расширенную информацию |
|3 |filter | `string`          | Фильтр типов записей |
|4 |fields | `string`          | Дополнительные поля, разделенные запятыми |
### Возвращает
`Generator`
> Если не указать id, то вернет посты владельца токена(сообщество или пользователь)
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
foreach ($vk->getAllWalls(1) as $post) {
    print_r($post);
}
```



## getAllGroupsFromUser
Получить все сообщества пользователя. Готовый генератор с оберткой над [groups.get](https://vk.com/dev/groups.get)
### Параметры метода
|# |Название | Тип | Описание |
|:-:|:-:|:--------------: |------------- |
|1 |user_id | `int`          | user_id |
|2 |extended | `bool`          | Возвращать ли расширенную информацию |
|3 |filter | `string`          | Фильтр сообществ |
|4 |fields | `string`          | Дополнительные поля, разделенные запятыми |
### Возвращает
`Generator`
> Если не указать user_id при использовании токена юзера, то вернет группы владельца токена
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
foreach ($vk->getAllGroupsFromUser() as $group) {
    print_r($group);
}
```


## getAllMembers
Получить всех участников сообщества. Готовый генератор с оберткой над [groups.getMembers](https://vk.com/dev/groups.getMembers)
### Параметры метода
|# |Название | Тип | Описание |
|:-:|:-:|:--------------: |------------- |
|1 |group_id | `int`          | group_id |
|2 |sort | `bool`          | Сортировка |
|3 |filter | `string`          | Фильтр |
|4 |fields | `string`          | Дополнительные поля, разделенные запятыми |
### Возвращает
`Generator`
> Если не указать group_id при использовании токена сообщества, то вернет участников этого сообщества
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
foreach ($vk->getAllMembers() as $member) {
    print $member;
}
```



## getAllComments
Получить все комментарии поста. Готовый генератор с оберткой над [wall.getComments](https://vk.com/dev/wall.getComments)
### Параметры метода
|# |Название | Тип | Описание |
|:-:|:-:|:--------------: |------------- |
|1 |**owner_id_or_url\*** | `int`\|`string`          | id владельца или ссылка на пост |
|2 |post_id | `int`          | Если передана ссылка в первом параметре, то этот не обязателен |
|3 |sort | `string`          | Сортировка. По умолчанию `asc` |
|4 |extended | `bool`          | Возвращать дополнительные поля |
|5 |fields | `string`          | Дополнительные поля, разделенные запятыми |
### Возвращает
`Generator`
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
$generator = $vk->getAllComments('https://vk.com/ps_kak_kretin?w=wall-75338985_1256502');
$generator = $vk->getAllComments(-75338985, 1256502, 'desc');
foreach ($generator as $comment) {
    print_r($comment);
}
```



## getAllDialogs
Получить все диалоги сообщества или пользователя в зависимости от токена. Готовый генератор с оберткой над [messages.getConversations](https://vk.com/dev/messages.getConversations)
### Параметры метода
|# |Название | Тип | Описание |
|:-:|:-:|:--------------: |------------- |
|1 |extended | `bool`          | Возвращать дополнительные поля |
|2 |filter | `string`          | Фильтр, по умолчанию `all` |
|3 |fields | `string`          | Дополнительные поля, разделенные запятыми |
### Возвращает
`Generator`
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
foreach ($vk->getAllDialogs() as $dialog) {
    print_r($dialog);
}
```



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
Получить дату регистрации пользователя
### Параметры метода
|# |Название | Тип | Описание | 
|:-:|:-:|:--------------: |------------- | 
|1 |**user_id\***  | `int`          | `user_id` Пользователя |
### Возвращает
Дата и время регистрации пользователя в формате `20:27:12 23.09.2006`
### Примеры использования
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;

$vk = vk::create(ТОКЕН, '5.126');
print $vk->dateRegistration(1); //"20:27:12 23.09.2006"
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
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
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
if($vk->isAdmin($user_id, $peer_id))
```
