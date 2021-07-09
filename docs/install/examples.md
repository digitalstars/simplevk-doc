---
title: Примеры ботов
---
## Минимальный Callback
> Бот отвечает на любое сообщение
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;
$vk = vk::create(ТОКЕН, '5.120')->setConfirm(STR); //STR - строка подтверждения сервера
$vk->reply('Привет, ~!fn~');
```


## Простой Callback
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\SimpleVK as vk;
$vk = vk::create(ТОКЕН, '5.120')->setConfirm(STR); //STR - строка подтверждения сервера
$vk->setUserLogError(ID); //ID - это id vk, кому бот будет отправлять все ошибки, возникние в скрипте
$data = $vk->initVars($peer_id, $user_id, $type, $message); //инициализация переменных из события
if($type == 'message_new') {
    if($message == 'Привет') {
        $vk->reply('Привет, ~!fn~');
    }
}
```


## Простой LongPoll / User LongPoll
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
            $vk->reply('Привет, ~!fn~');
        }
    }
});
```


## Минимальный Бот на конструкторе (Callback)
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\SimpleVK\Bot;
$bot = Bot::create(ТОКЕН, '5.120');
$bot->cmd('img', '!картинка')->img('cat.jpg')->text('Вот твой кот');
$bot->run(); //запускаем обработку события
```


## Минимальный Бот на конструкторе (LongPoll)
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


## Бот с обработкой Команд на конструкторе (Callback)
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


## Бот с обработкой Кнопок на конструкторе (Callback)
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


## Бот на конструкторе, с использованием хранилища (Callback)
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


## Auth и Proxy (longpoll)
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';

use DigitalStars\simplevk\{Auth, LongPoll, SimpleVK as vk};

vk::setProxy("socks4://149.56.1.48:8181");  // Задаём прокси

$auth = Auth::create('LOGIN', 'PASS')           // Авторизация через пользователя
->app('ios')                        // Через официальное приложение для ios
->captchaHandler(function ($sid, $img) {    // Отлов каптчи при авторизации
//    echo "\nIMG: $img\n";
    return trim(fgets(STDIN));      // Ожидание и ввод из консоли решения каптчи
});

echo "Access_token: " . $auth->getAccessToken() . "\n";  // Вывод токена

$lp = LongPoll::create($auth, '5.103');
$lp->setUserLogError(12345); // В случае ошибки отправить её на этот id vk

$lp->listen(function ($data) use ($lp) {                       // Получение событий из LongPool
    $lp->initVars($id, $user_id, $type, $message, $payload, $msg_id, $attachments);   // Парсинг полученных событий
    if ($type == 'message_new') {                                     // Если событие - новое сообщение
        $lp->reply("Тестовое сообщение");                       // Отправка ответного сообщения
    }
});
```


## Бот на конструкторе с многоуровневыми клавиатурами (longpoll)
Для бота необходимы картинки, [которые вы можете скачать тут](https://disk.yandex.ru/d/gnA-ohSMV0pr_w)
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\simplevk\{Bot, LongPoll};

$vk = LongPoll::create("TOKEN", "5.110");
$bot = Bot::create($vk); // Инициализация конструктора ботов

$bot->btn('animals', $vk->buttonText("Животные", 'blue'))->text("Вы выбрали животных\nТип:")->kbd([['animal_1', 'animal_2', 'animal_3'], ['animal_random'], ['back_first']]);
$bot->btn('animal_1', $vk->buttonText("Млекопитающие", 'blue'))->text("Вы выбрали Млекопитающих\nКонкретнее?")->kbd([['animal_1_1', 'animal_1_2', 'animal_1_3'], ['in_first'], ['to_animals']]);
$bot->btn('animal_2', $vk->buttonText("Моллюски", 'blue'))->text("Вы выбрали Молюсков\nКонкретнее?")->kbd([['animal_2_1', 'animal_2_2', 'animal_2_3'], ['in_first'], ['to_animals']]);
$bot->btn('animal_3', $vk->buttonText("Иглокожие", 'blue'))->text("Вы выбрали Иглокожих\nКонкретнее?")->kbd([['animal_3_1', 'animal_3_2', 'animal_3_3'], ['in_first'], ['to_animals']]);
$bot->btn('animal_1_1', $vk->buttonText('Медведь', 'blue'))->text("Вы выбрали медведя!")->img("img\a11.jpg");
$bot->btn('animal_1_2', $vk->buttonText('Волк', 'white'))->text("Вы выбрали волка!")->img("./img/a12.jpg");
$bot->btn('animal_1_3', $vk->buttonText('Суслик', 'green'))->text("Вы выбрали суслика!")->img("./img/a13.jpg");
$bot->btn('animal_2_1', $vk->buttonText('Устрица', 'blue'))->text("Вы выбрали устрицу!")->img("./img/a21.jpg");
$bot->btn('animal_2_2', $vk->buttonText('Кальмар', 'white'))->text("Вы выбрали кальмара!")->img("./img/a22.jpg");
$bot->btn('animal_2_3', $vk->buttonText('Прудовик', 'green'))->text("Вы выбрали прудовика!")->img("./img/a23.jpg");
$bot->btn('animal_3_1', $vk->buttonText('Голотурия', 'blue'))->text("Вы выбрали голотурию!")->img("./img/a31.jpg");
$bot->btn('animal_3_2', $vk->buttonText('Морской ёж', 'white'))->text("Вы выбрали морского ежа!")->img("./img/a32.jpg");
$bot->btn('animal_3_3', $vk->buttonText('Морская звезда', 'green'))->text("Вы выбрали морскую звезду!")->img("./img/a33.jpg");
$bot->btn('animal_random', $vk->buttonText("Случайный вид животного", 'white'))->func(function () use ($bot) { //доп обработка после нажатия на кнопку
    $bot->run(['animal_1', 'animal_2', 'animal_3'][rand(0, 2)]);
    return 1;
});

$bot->btn('mush', $vk->buttonText("Грибы", 'white'))->text("Вы выбрали грибы\nТип:")->kbd([['mush_1', 'mush_2', 'mush_3'], ['mush_random'], ['back_first']]);
$bot->btn('mush_1', $vk->buttonText("Съедобные", 'blue'))->text("Вы выбрали Съедобные\nКонкретнее?")->kbd([['mush_1_1', 'mush_1_2', 'mush_1_3'], ['in_first'], ['to_mush']]);
$bot->btn('mush_2', $vk->buttonText("Условно съедобные", 'blue'))->text("Вы выбрали Условно съедобные\nКонкретнее?")->kbd([['mush_2_1', 'mush_2_2', 'mush_2_3'], ['in_first'], ['to_mush']]);
$bot->btn('mush_3', $vk->buttonText("Ядовитые", 'blue'))->text("Вы выбрали Ядовитые\nКонкретнее?")->kbd([['mush_3_1', 'mush_3_2', 'mush_3_3'], ['in_first'], ['to_mush']]);
$bot->btn('mush_1_1', $vk->buttonText('Подберёзовик', 'blue'))->text("Вы выбрали подберёзовик!")->img("./img/m11.jpg");
$bot->btn('mush_1_2', $vk->buttonText('Опята', 'white'))->text("Вы выбрали опята!")->img("./img/m12.jpg");
$bot->btn('mush_1_3', $vk->buttonText('Лисичка', 'green'))->text("Вы выбрали лисичку!")->img("./img/m13.jpg");
$bot->btn('mush_2_1', $vk->buttonText('Волнушка', 'blue'))->text("Вы выбрали волнушку!")->img("./img/m21.jpg");
$bot->btn('mush_2_2', $vk->buttonText('Свинушка', 'white'))->text("Вы выбрали свинушку!")->img("./img/m22.jpg");
$bot->btn('mush_2_3', $vk->buttonText('Валуй', 'green'))->text("Вы выбрали валуй!")->img("./img/m23.jpg");
$bot->btn('mush_3_1', $vk->buttonText('Желчный', 'blue'))->text("Вы выбрали голотурию!")->img("./img/m31.jpg");
$bot->btn('mush_3_2', $vk->buttonText('Сатанинский', 'white'))->text("Вы выбрали морского ежа!")->img("./img/m32.jpg");
$bot->btn('mush_3_3', $vk->buttonText('Мухомор', 'green'))->text("Вы выбрали мухомор!")->img("./img/m33.jpg");
$bot->btn('mush_random', $vk->buttonText("Случайный вид грибов", 'white'))->func(function () use ($bot) {
    $bot->run(['mush_1', 'mush_2', 'mush_3'][rand(0, 2)]);
    return 1;
});

$bot->btn('tree', $vk->buttonText("Растения", 'green'))->text("Вы выбрали деревья\nТип:")->kbd([['tree_1', 'tree_2', 'tree_3'], ['tree_random'], ['back_first']]);
$bot->btn('tree_1', $vk->buttonText("Хвойные", 'blue'))->text("Вы выбрали Хвойные\nКонкретнее?")->kbd([['tree_1_1', 'tree_1_2'], ['in_first'], ['to_tree']]);
$bot->btn('tree_2', $vk->buttonText("Лиственные", 'blue'))->text("Вы выбрали Лиственницу\nКонкретнее?")->kbd([['tree_2_1', 'tree_2_2', 'tree_2_3'], ['in_first'], ['to_tree']]);
$bot->btn('tree_3', $vk->buttonText("Кустарники", 'blue'))->text("Вы выбрали Кустарники\nКонкретнее?")->kbd([['tree_3_1', 'tree_3_2', 'tree_3_3'], ['in_first'], ['to_tree']]);
$bot->btn('tree_1_1', $vk->buttonText('Ель', 'blue'))->text("Вы выбрали ель!")->img("./img/t11.jpg");
$bot->btn('tree_1_2', $vk->buttonText('Сосна', 'white'))->text("Вы выбрали сосну!")->img("./img/t12.jpg");
$bot->btn('tree_2_1', $vk->buttonText('Дуб', 'blue'))->text("Вы выбрали дуб!")->img("./img/t21.jpg");
$bot->btn('tree_2_2', $vk->buttonText('Клён', 'white'))->text("Вы выбрали клён!")->img("./img/t22.jpg");
$bot->btn('tree_2_3', $vk->buttonText('Берёза', 'green'))->text("Вы выбрали берёзу!")->img("./img/t23.jpg");
$bot->btn('tree_3_1', $vk->buttonText('Яблоня', 'blue'))->text("Вы выбрали яблоню!")->img("./img/t31.jpg");
$bot->btn('tree_3_2', $vk->buttonText('Вишня', 'white'))->text("Вы выбрали вишню!")->img("./img/t32.jpg");
$bot->btn('tree_3_3', $vk->buttonText('Малина', 'green'))->text("Вы выбрали малину!")->img("./img/t33.jpg");
$bot->btn('tree_random', $vk->buttonText("Случайный вид дерева", 'white'))->func(function () use ($bot) {
    $bot->run(['tree_1', 'tree_2', 'tree_3'][rand(0, 2)]);
    return 1;
});

$bot->btn('first')->text("Выберите вид")->kbd([['animals', 'mush', 'tree'], ['random_type']]);
$bot->btn('random_type', $vk->buttonText("Случайный тип", 'red'))->func(function () use ($bot) {
    $bot->run(['animals', 'mush', 'tree'][rand(0, 2)]);
    return 1;
});

$bot->redirect('back_first', 'first')->btn('back_first', $vk->buttonText("<< Назад", 'red')); // При нажатии на кнопку с id back_first произойдёт то же, что и при нажатии на кнопку с id first
$bot->redirect('in_first', 'first')->btn('in_first', $vk->buttonText("В начало!", 'red'));
$bot->redirect('to_animals', 'animals')->btn('to_animals', $vk->buttonText("<< Назад", 'red'));
$bot->redirect('to_mush', 'mush')->btn('to_mush', $vk->buttonText("<< Назад", 'red'));
$bot->redirect('to_tree', 'tree')->btn('to_tree', $vk->buttonText("<< Назад", 'red'));

// Обраюотка команд
$bot->cmd('first', '!старт');
$bot->cmd('animals', '!меню животных');  // Привязка id "animals" к команде '!меню животных'
$bot->cmd('tree', '!меню ростений');
$bot->cmd('mush', '!меню грибов');
$bot->cmd('other')->text("Доступные комманды:" .
    "\n!старт - в начало" .
    "\n!меню животных - показать животных" .
    "\n!меню ростений - показать меню ростений" .
    "\n!меню грибов - показать меню грибов");

$vk->listen(function ($data) use ($vk, $bot) {
    $bot->run();  // Инициализация бота
});
```


## Примеры btn, cmd, preg_cmd в конструкторе (longpoll)
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\simplevk\{Bot, LongPoll};

$vk = LongPoll::create("", "5.110");
$bot = Bot::create($vk);

$bot->btn('first')->text("Команда не найдена" .
    "\nДоступные команды: " .
    "\n!посчитай число + число \n---пример '!посчитай 5 + 5'" .
    "\n!посчитай число * число \n---пример '!посчитай 5 * 5'" .
    "\n!напиши мне слово любое_слово \n---пример '!напиши мне слово Привет!'" .
    "\n!напиши что угодно \n---пример '!напиши Какой то рандомный текст'" .
    "\n!покажи кнопку [слово] [white,blue,red,green] \n---пример '!покажи кнопку Кнопочка green'");

$bot->redirect('other', 'first');

$bot->cmd('sum', '!посчитай %n + %n')->func(function ($msg, $params) {
    $msg->text($params[0] + $params[1]);
});

$bot->cmd('multiply', '!посчитай %n * %n')->func(function ($msg, $params) {
    $msg->text($params[0] * $params[1]);
});

$bot->cmd('word', '!напиши мне слово %s')->func(function ($msg, $params) {
    $msg->text("Ваше слово: " . $params[0]);
});

$bot->preg_cmd('more_word', "!\!напиши (.*)!")->func(function ($msg, $params) {
    $msg->text("Ваше предложение: " . $params[1]);
});

$bot->cmd('send_btn', '!покажи кнопку %s %s')->text('Ваша кнопка: ')->func(function ($msg, $params) use ($vk) {
    if (!in_array($params[1], ['white', 'blue', 'red', 'green'])) {
        $msg->text("Цвет " . $params[1] . " не существует, использую 'white'\n" . $msg->getText());
        $params[1] = 'white';
    }
    $msg->kbd([[$vk->buttonText($params[0], $params[1])]]);
});

$vk->listen(function () use ($vk, $bot) {
    $bot->run();
});
```


## callback кнопки
```php
<?php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\simplevk\Bot;

$bot = Bot::create("TOKEN", "5.120");
$bot->isAllBtnCallback(true); //все кнопки по дефолту - callback

$kbd = [['link', 'app'], ['edit', 'bar']];
$bot->btn('link', 'Ссылка')->eventAnswerOpenLink('https://yandex.ru'); //инициализируем кнопку link и назвачаем действия, которое произойдет после ее нажатия
$bot->btn('app', 'Приложение')->eventAnswerOpenApp(7150924, 105083531);
$bot->btn('bar', 'Snackbar')->eventAnswerSnackbar('Snackbar');
$bot->btn('edit', rand(100, 999))->edit()->text('callback')->kbd($kbd, true); //инициализируем пустую. При ее нажатии - изменяем сообщение, в котором она была нажата
$bot->cmd('command', '!кнопки')->text('callback')->kbd($kbd, true);// обработка команды !кнопки
$bot->run();
```


## Игра крестики-нолики на callback кнопках
Это игра крестики-нолики, работающая как в беседах, так и в ЛС на callback кнопках. Можно играть даже партию, если люди в разных беседах.  
Работает без использования базы данных, все данные игры хранятся внутри payload, а долгосрочные данные в Store модуле
```php
require_once __DIR__.'/vendor/digitalstars/simplevk/autoload.php';
use DigitalStars\simplevk\{Bot, LongPoll, Store, SimpleVK};

$tokens = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
];

$vk = SimpleVK::create($tokens[array_rand($tokens)], "5.126")->setConfirm('4a1855e7');
$vk->setUserLogError(89846036); // В случае ошибки отправить её на этот id vk
$bot = Bot::create($vk)->isAllBtnCallback(); // Инициализация $bot и все кнопки по умолчанию Callback

$vk->initVars($null, $user_id, $type, $message, $payload);

if($type == 'message_new') {
    if($payload) {
        $vk->reply('Кнопки можно нажимать только с мобильных клиентов, поддерживающих callback кнопки!');
        exit();
    }
}

try {

    function checkWin($map, $s) {   // Проверка на выигрыш или ничью
        $win_positions = [  // Все выигрышные позиции (3 символа подряд)
            $map[0], $map[1], $map[2],
            [$map[0][0], $map[1][0], $map[2][0]],
            [$map[0][1], $map[1][1], $map[2][1]],
            [$map[0][2], $map[1][2], $map[2][2]],
            [$map[0][0], $map[1][1], $map[2][2]],
            [$map[0][2], $map[1][1], $map[2][0]]];
        if (in_array([$s, $s, $s], $win_positions)) // Если найдено 3 символа подряд, то это победа
            return true;
        else
            return in_array('_', array_merge($map[0], $map[1], $map[2])) ? false : 'Ничья'; // Если НЕ найдено пустое место - Ничья, иначе игра продолжается
    }

    function getKeyboard($map, $opponent, $opponent_user_id, $msg_id, $msg_id_enemy, $symbol, $symbol_enemy, $current_hod, $active, $current_user_id = null) {  // Заполняет Payload кнопок
        global $bot;
        foreach ([0, 1, 2] as $row) {
            foreach ([0, 1, 2] as $col) {
                $kbd[$row][$col] = $bot->editBtn($map[$row][$col])->payload( // Получает кнопку бота по ID и изменяет её пейлоад
                    ['row' => $row,    // Строка на которой кнопка
                        'col' => $col,  // Столбец
                        'opponent' => $opponent,  // id оппонента (peer_id)
                        'ouid' => $opponent_user_id,  // id оппонента
                        'symbol' => $symbol,  // Символ игрока
                        'symbol_enemy' => $symbol_enemy,  // Символ противника
                        'hod' => $current_hod,  // какой игрок должен ходить
                        'map' => $map,  // Карта игры
                        'active' => $active, // true/false - игра активна?
                        'msg_id' => $msg_id,  // ID сообщения с игрой
                        'msg_id_enemy' => $msg_id_enemy,
                        'cuid' => $current_user_id //текущий юзер id
                    ]  // ID сообщения противника с игрой
                )->dump();  // Получить кнопку в сыром виде
            }
        }
        return $kbd;
    }

    $bot->cmd('help', '!помощь')->text("Доступные команды:\n!поиск - начать игру\n!выход - выйти из поиска\n!помощь - показать эту справку");  // Текст справки
    $bot->redirect('first', 'help');  // Кнопка начать ведёт на справку

    $bot->cmd('search', '!поиск')->func(function () use ($vk, $bot) {  // Команда "!поиск"
        $vk->initVars($peer_id, $user_id, $null, $null, $payload);  // Инициализация $user_id
        $store = Store::load()->getWriteLock();  // Инициализация глобального хранилища и получение блокировки на запись
        $opponent = $store->get('wait');  // получить id юзера на поиске
        if (!$opponent) {  // Если его не существует
            $store->sset('wait', [$user_id, $peer_id]);  // Текущий юзер встаёт в очередь
            $vk->reply("Вы встали в очередь и ожидаете игру");  // Ответить
            return 1;  // Прервать выполнение события
        }

        if ($opponent[0] == $user_id) {  // Если в поиске тот же, кто запросил снова поиск
            $vk->reply("Вы уже в поиске");  // Ответить
            return 1; // Прервать выполнение события
        }

        $store->unset('wait');  // Очистка поиска
        if (random_int(0, 1) == 1) {
            $users1 = [$opponent[0], $user_id];
            $users2 = [$opponent[1], $peer_id];
        } else {
            $users1 = [$user_id, $opponent[0]];
            $users2 = [$peer_id, $opponent[1]];
        }

        $default_map = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']]; // Начальная карта игры
        if ($users2[1] > 2e9 && $users2[0] > 2e9) {
            $msg_id1 = $bot->msg()->text("Подготовка")->send([$users2[0]])[0]['conversation_message_id'];  // Отправка сообщения, в котором будет игра, и получение его id
            $kbd1 = getKeyboard($default_map, $users2[1], $users1[1], $msg_id1, $msg_id1, 'X', 'O', $users1[0], true, $users1[0]);  // Получение клавиатуры для текущего игрока
            $bot->msg()->text("Игра началась. Игроки: @id{$users1[0]}, @id{$users1[1]}\nПервым ходит: @id{$users1[0]}")->kbd($kbd1, true)->sendEdit($users2[0], null, $msg_id1); // Редактирование сообщения на игровое
        } else {
            $msg_id1 = $bot->msg()->text("Подготовка")->send([$users2[0]])[0]['conversation_message_id'];  // Отправка сообщения, в котором будет игра, и получение его id
            $msg_id2 = $bot->msg()->text("Подготовка")->send([$users2[1]])[0]['conversation_message_id'];  // Отправка сообщения, в котором будет игра, и получение его id
            $kbd1 = getKeyboard($default_map, $users2[1], $users1[1], $msg_id1, $msg_id2, 'X', 'O', $users1[0], true);  // Получение клавиатуры для текущего игрока
            $kbd2 = getKeyboard($default_map, $users2[0], $users1[0], $msg_id2, $msg_id1, 'O', 'X', $users1[0], true); // Получение клавиатуры для противника
            $bot->msg()->text("Игра началась. Игроки: @id{$users1[0]}, @id{$users1[1]}\nПервым ходит: @id{$users1[0]}")->kbd($kbd1, true)->sendEdit($users2[0], null, $msg_id1); // Редактирование сообщения на игровое
            $bot->msg()->text("Игра началась. Игроки: @id{$users1[0]}, @id{$users1[1]}\nПервым ходит: @id{$users1[0]}")->kbd($kbd2, true)->sendEdit($users2[1], null, $msg_id2); // Редактирование сообщения на игровое
        }
    });

    $bot->cmd('exit', '!выход')->text('Вы вышли из поиска')->func(function ($msg) use ($vk) { // Команда "!выход" и текст ответа по умолчанию
        $vk->initVars($null, $user_id, $null, $null, $payload); // Инициализация $user_id
        $store = Store::load()->getWriteLock(); // Инициализация глобального хранилища и получение блокировки на запись
        $wait = $store->get('wait');  // Получение id игрока в очереди
        if ($wait == $user_id)  // Если текущий юзер в поиске
            $store->unset('wait');  // Очистить очередь
        else
            $msg->text("Выходить неоткуда"); // Изменить текст сообщения
    });

    $bot->cmd('stat', '!играстат')->func(function ($msg) use ($vk) { // Команда "!играстат" и вывод статы игрока
        $vk->initVars($null, $user_id, $null, $null, $payload); // Инициализация $user_id
        $store = Store::load($user_id); // Инициализация хранилища юзера
        $winAll = $store->get('winAll') ?? 0;  // победы
        $loseAll = $store->get('loseAll') ?? 0;  // поражения
        $msg->text("~!full~\nПобед: $winAll, поражений: $loseAll");
    });

    $bot->btn('O', ["O", 'green'])->eventAnswerSnackbar("Такой ход уже сделан"); // При клике на кнопку "O" вывести уведомление с текстом
    $bot->btn('X', ["X", 'red'])->eventAnswerSnackbar("Такой ход уже сделан"); // При клике на кнопку "X" вывести уведомление с текстом
    $bot->btn('_', ["&#160;&#160;"])->edit()->func(function ($msg) use ($vk, $bot) { // При клике на пустую кнопку редактировать сообщение в котором была нажата кнопка
        $vk->initVars($peer_id, $user_id, $null, $null, $payload);  // Инициализация $user_id
        if (!$payload['active']) {  // Если эта игра уже закончилась
            $vk->eventAnswerSnackbar('Игра завершена');  // Отправить уведомление
            return 1; // Прервать выполнение
        }
        if ($user_id != $payload['hod']) {  // Если сейчас не ход текущего игрока
            $vk->eventAnswerSnackbar('Сейчас не ваш ход');  // Отправить уведомление
            return 1; // Прервать выполнение
        }
        $msg2 = $bot->msg();  // Сообщение для противника
        $map = $payload['map'];  // Карта
        $map[$payload['row']][$payload['col']] = $payload['symbol']; // Добавить ход на корту
        $check_win = checkWin($map, $payload['symbol']);  // Получить статус (победа/ничья/продолжение игры)
        $store = Store::load($user_id); // Инициализация глобального хранилища и получение блокировки на запись
        $store2 = Store::load($payload['ouid']); // Инициализация глобального хранилища и получение блокировки на запись
        if ($check_win === true) {  // Если это победа
            $win = $store->get('win');
            if(isset($win[$payload['ouid']]))
                $win[$payload['ouid']] += 1;
            else
                $win[$payload['ouid']] = 1;
            $winAll = $store->get('winAll');
            $store->set('win', $win); //увеличиваем счетчик побед против этого игрока
            if($winAll) {
                $store->sset('winAll', $winAll++); //увеличиваем общий счетчик побед игрока
            } else {
                $store->sset('winAll', 1);
            }
            $loseAll2 = $store2->get('loseAll');
            if($loseAll2) {
                $store2->sset('loseAll', $loseAll2++);
            } else {
                $store2->sset('loseAll', 1);
            }

            $win2 = $store2->get('win')[$user_id] ?? 0;
            $msg->text("Победил ~!ln|$user_id~(".$win[$payload['ouid']]."), проиграл ~!ln|$payload[ouid]~(".$win2.")");  // Текст ответного сообщения
            $msg2->text("Победил ~!ln|$user_id~(".$win[$payload['ouid']]."), проиграл ~!ln|$payload[ouid]~(".$win2.")");  // Текст сообщения для противника
            $active = false;  // Игра завершена
        } else if ($check_win === 'Ничья') {  // Если это ничья
            $win = $store->get('win')[$user_id] ?? 0;
            $win2 = $store->get('win')[$payload['ouid']] ?? 0;
            $msg->text("Ничья!\n~!ln|$user_id~($win2)\n~!ln|$payload[ouid]~($win)");  // Текст ответного сообщения
            $msg2->text("Ничья!\n~!ln|$user_id~($win2)\n~!ln|$payload[ouid]~($win)");  // Текст сообщения для противника
            $active = false;  // Игра завершена
        } else {
            if ($payload['symbol'] == 'X') {
                $next_symbol = 'нолик';
            } else {
                $next_symbol = 'крестик';
            }
            $msg->text("Ход @id$payload[ouid]! ($next_symbol)");  // Текст ответного сообщения
            $msg2->text("Ход @id$payload[ouid]! ($next_symbol)");  // Текст сообщения противника
            $active = true;  // Игра продолжается
        }

        // Получить и добавить клавиатуру к ответному сообщению
        if (!$payload['cuid']) {
            $msg->kbd(getKeyboard($map, $payload['opponent'], $payload['ouid'], $payload['msg_id'], $payload['msg_id_enemy'], $payload['symbol'], $payload['symbol_enemy'], false, $active), true);  // Получить и добавить клавиатуру к ответному сообщению
            $msg2->kbd(getKeyboard($map, $peer_id, $user_id, $payload['msg_id_enemy'], $payload['msg_id'], $payload['symbol_enemy'], $payload['symbol'], true, $active), true)  //  Получить и добавить клавиатуру к сообщению противнику
            ->sendEdit($payload['opponent'], null, $payload['msg_id_enemy']);  // Редактировать сообщение противника
        } else {
            $msg->kbd(getKeyboard($map, $peer_id, $user_id, $payload['msg_id_enemy'], $payload['msg_id'], $payload['symbol_enemy'], $payload['symbol'], $payload['ouid'], $active, $payload['ouid']), true);
        }

    });  // Ответное сообщение и так отредактирует сообщение с игрой, благодаря команде ->edit() при инициализации события

} catch (Exception $e) {;}

$bot->run();  // Обработать событие
```

## Больше примеров
В документации для каждого метода есть примеры его использования.