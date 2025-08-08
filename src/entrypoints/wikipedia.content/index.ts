export default defineContentScript({
  matches: ['*://*.wikipedia.org/*'],
  main() {
    console.info('🎉 Wikipedia content script loaded!');

    function onPageLoad() {
      console.info('📚 Wikipedia page loaded successfully!');

      const pageTitle = document.title;
      console.info('📖 Page title:', pageTitle);

      const isArticlePage = document.querySelector('#content') !== null;
      console.info('🔍 Is article page:', isArticlePage);

      const mainContent = document.querySelector('#mw-content-text');
      if (mainContent) {
        console.info('📄 Main content found');
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onPageLoad);
    } else {
      onPageLoad();
    }

    window.addEventListener('load', () => {
      console.info('🖼️ Page fully loaded with all resources');
    });
  },
});
