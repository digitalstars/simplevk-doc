module.exports = {
  title: 'SimpleVK 3',
  description: "Документация по библиотеке для vk api PHP",
  ga: "UA-128764821-2",
  base: '/v3/',
  themeConfig:{
    logo: '/assets/logo.png',
    nav: [
      { text: 'v2.x', link: "https://simplevk.scripthub.ru/"},
      { text: 'GitHub', link: 'https://github.com/digitalstars/simplevk' },
      { text: 'Чат разработчиков', link: 'https://vk.me/join/AJQ1dzQRUQxtfd7zSm4STOmt' },
    ],
    sidebar: [
      {
        title: 'Начало работы',
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
        title: 'Классы',
        collapsable: false,
        children: [
          '/classes/simplevk',
          '/classes/message',
          '/classes/bot'
        ]
      }
    ]
  }
}