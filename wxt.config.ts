import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    host_permissions: ['<all_urls>'],
    permissions: ['storage', 'activeTab', 'tabs'],
    action: {
      default_title: 'RRWeb Recorder',
      default_popup: 'popup/index.html',
    },
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true,
    },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content/index.ts'],
      },
    ],
  },
});
