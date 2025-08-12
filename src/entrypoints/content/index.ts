import { ExtensionRecorder } from '@/lib/functions/recorder/extensionRecorder';
import { onMessage, sendMessage } from '@/entrypoints/background/messaging/messaging';
import { MessageType } from '@/lib/enums/messages';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const extensionRecorder = new ExtensionRecorder();

    onMessage(MessageType.RecordingStart, () => {
      extensionRecorder.startRecording();
      browser.storage.local.set({ isRecording: true });
      console.info('Recording started in content script');
    });

    onMessage(MessageType.RecordingStop, async () => {
      extensionRecorder.stopRecording();
      const events = extensionRecorder.getEvents();

      console.info('events in content script', events);

      sendMessage(MessageType.RecordingData, {
        events: events,
      });

      browser.storage.local.set({
        isRecording: false,
      });

      console.info(`Recording stopped in content script. Events captured: ${events.length}`);
    });

    onMessage(MessageType.TabSwitch, async () => {
      console.info('Tab switch detected in content script');

      if (extensionRecorder.isCurrentlyRecording()) {
        extensionRecorder.stopRecording();
        const events = extensionRecorder.getEvents();

        console.info('Saving events before tab switch:', events.length);

        sendMessage(MessageType.RecordingData, {
          events: events,
        });

        extensionRecorder.startRecording();
        console.info('Recording restarted for new tab');
      }
    });

    console.info('RRWeb content script loaded');
  },
});
