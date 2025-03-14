import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  lang: 'ru-RU',

  head: [
    // ['meta', { name: 'robots', content: 'index, follow' }], // Разрешаем индексацию
    // ['meta', { name: 'keywords', content: 'ключевые слова, seo, vuepress' }], // Ключевые слова
    // ['meta', { name: 'author', content: 'Твоё Имя' }], // Автор страницы
    // ['meta', { property: 'og:title', content: 'Название сайта' }], // Open Graph для соцсетей
    // ['meta', { property: 'og:description', content: 'Описание сайта' }],
    // ['meta', { property: 'og:type', content: 'website' }],
    // ['meta', { property: 'og:image', content: '/images/preview.jpg' }], // Картинка для соцсетей
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  base: "/simplevk-doc/",
  title: 'SimpleVK 3',
  description: "Документация по библиотеке для simpleVK-php",
  // редирект с главной
  clientConfigFile: path.resolve(__dirname, 'client.js'),

  bundler: viteBundler(),
  theme: defaultTheme({
    logo: '/assets/logo.svg',
    navbar: [
      // { text: 'v2.x', link: "https://simplevk.scripthub.ru/"},
      { text: 'GitHub', link: 'https://github.com/digitalstars/simpleVK-php' },
      { text: 'Чат разработчиков', link: 'https://vk.me/join/AJQ1dzQRUQxtfd7zSm4STOmt' },
    ],

    docsRepo: 'digitalstars/simplevk-doc',
    docsDir: 'docs',
    docsBranch: 'master',
    colorMode: 'dark', // По умолчанию темная тема

    editLinks: true,
    editLinkText: 'Редактировать эту страницу на GitHub',

    plugins: [
      ['@vuepress/search', {
        searchMaxSuggestions: 10
      }]
    ],
    sidebar: [
      {
        text: 'Начало работы',
        collapsable: false,
        children: [
          '/install/who_simplevk',
          '/install/site_helper',
          '/install/requirements',
          '/install/install',
          '/install/examples',
        ]
      },
      {
        text: 'Классы',
        collapsable: false,
        children: [
          '/classes/simplevk',
          '/classes/message',
          '/classes/bot'
        ]
      }
    ],
    locales: {
      '/': {
        lastUpdatedText: 'Последнее обновление',
        next: 'Следующая',
        prev: 'Предыдущая',
      },
    },
  }),
})
