import { registerPopupHandlers } from '@/entrypoints/background/messagingHandlers/logHandler';
import { registerStorageHandlers } from '@/entrypoints/background/messagingHandlers/storageHandler';

export default defineBackground(() => {
  console.info('Hello background!');
  // will output the different result based on if was built with :client or not
  console.info('VARIABLE:', import.meta.env.WXT_VARIABLE);
  registerPopupHandlers();
  registerStorageHandlers();
});
