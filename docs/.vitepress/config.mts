import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config

export default defineConfig({
    lang: 'ru-RU',
    title: "SimpleVK-PHP",
    description: "Документация библиотеки SimpleVK-PHP",
    base: "/simplevk-doc/",
    cleanUrls: true,
    // srcDir: './docs',
    appearance: 'dark',
    lastUpdated: true,

    head: [
        // ['meta', { name: 'robots', content: 'index, follow' }], // Разрешаем индексацию
        // ['meta', { name: 'keywords', content: 'ключевые слова, seo, vuepress' }], // Ключевые слова
        // ['meta', { name: 'author', content: 'Твоё Имя' }], // Автор страницы
        // ['meta', { property: 'og:title', content: 'Название сайта' }], // Open Graph для соцсетей
        // ['meta', { property: 'og:description', content: 'Описание сайта' }],
        // ['meta', { property: 'og:type', content: 'website' }],
        // ['meta', { property: 'og:image', content: '/images/preview.jpg' }], // Картинка для соцсетей
        // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['link', {rel: 'icon', href: '/simplevk-doc/favicon.ico'}] //withBase почему-то не работает
    ],

    themeConfig: {

        editLink: {
            pattern: 'https://github.com/digitalstars/simplevk-doc/edit/master/docs/:path',
            text: 'Редактировать страницу'
        },
        outline: { label: 'Содержание страницы' },
        docFooter: {
            prev: 'Предыдущая страница',
            next: 'Следующая страница'
        },
        lastUpdated: {
            text: 'Обновлено'
        },
        darkModeSwitchLabel: 'Оформление',
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на тёмную тему',
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Вернуться к началу',
        langMenuLabel: 'Изменить язык',
        skipToContentLabel: 'Перейти к содержимому',

        logo: '/logo.png',
        nav: [
            // { text: 'Home', link: '/' },
            {text: 'Чат разработчиков', link: 'https://vk.me/join/AJQ1dzQRUQxtfd7zSm4STOmt'}
        ],

        socialLinks: [
            {icon: 'github', link: 'https://github.com/digitalstars/simpleVK-php'}
        ],

        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: 'Поиск',
                        buttonAriaLabel: 'Поиск',
                    },
                    modal: {
                        noResultsText: 'Нет результатов для',
                        resetButtonTitle: 'Очистить запрос',
                        footer: {
                            selectText: 'выбрать',
                            navigateText: 'перейти',
                            closeText: 'закрыть',
                        },
                    },
                },
            }
        },

        sidebar: [
            {
                text: 'Начало работы',
                collapsed: false,
                items: [
                    {text: 'Почему SimpleVK?', link: '/install/who_simplevk'},
                    {text: 'Как пользоваться сайтом', link: '/install/site_helper'},
                    {text: 'Системные требования и установка', link: '/install/requirements'},
                    {text: 'Подключение', link: '/install/install'},
                    {text: 'Примеры ботов', link: '/install/examples'},
                ]
            },
            {
                text: 'Классы',
                collapsed: false,
                items: [
                    {text: 'SimpleVK', link: '/classes/simplevk'},
                    {text: 'Message', link: '/classes/message'},
                    {text: 'Bot', link: '/classes/bot'},
                ]
            }
        ],

        footer: {
            message: 'Опубликовано под лицензией MIT.',
            copyright: '© 2017 – настоящее время, Кирилл Миновский, Антон Колобов'
        },
        // locales: {
        //   '/': {
        //     lastUpdatedText: 'Последнее обновление',
        //     next: 'Следующая',
        //     prev: 'Предыдущая',
        //   },
        // },
    }
})