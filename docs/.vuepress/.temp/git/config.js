import { GitContributors } from "C:/Users/mrkir/PhpstormProjects/simplevk-doc/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_2dbfef188ccfd5198302272d85f9af6d/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "C:/Users/mrkir/PhpstormProjects/simplevk-doc/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_2dbfef188ccfd5198302272d85f9af6d/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
