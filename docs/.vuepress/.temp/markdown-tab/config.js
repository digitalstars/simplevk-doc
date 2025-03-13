import { CodeTabs } from "C:/Users/mrkir/PhpstormProjects/simplevk-doc/node_modules/.pnpm/@vuepress+plugin-markdown-t_e460abdbaaa5527806437d5555263209/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "C:/Users/mrkir/PhpstormProjects/simplevk-doc/node_modules/.pnpm/@vuepress+plugin-markdown-t_e460abdbaaa5527806437d5555263209/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "C:/Users/mrkir/PhpstormProjects/simplevk-doc/node_modules/.pnpm/@vuepress+plugin-markdown-t_e460abdbaaa5527806437d5555263209/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
