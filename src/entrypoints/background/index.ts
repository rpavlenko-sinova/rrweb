import { registerRecordingHandler } from '@/entrypoints/background/messaging/handlers/recording';

export default defineBackground(() => {
  registerRecordingHandler();
});
