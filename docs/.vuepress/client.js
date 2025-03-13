import { defineClientConfig } from '@vuepress/client';


export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // Настройка редиректа с главной страницы
    router.beforeEach((to, from, next) => {
      if (to.path === '/') {
        next('/install/who_simplevk'); // Перенаправление на нужную страницу
      } else {
        next();
      }
    });
  },
});