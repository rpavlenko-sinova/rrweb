import { onMessage, sendMessage, type TRecordingDataRequest } from '@/entrypoints/background/messaging/messaging';
import { MessageType } from '@/lib/enums/messages';
import { type eventWithTime } from '@rrweb/types';
import { indexedDBManager } from '@/lib/functions/database';

let isRecording = false;
const recordingHistory: {
  tabId: number;
  events: eventWithTime[];
  timestamp: number;
}[] = [];
let previousTabId: number | null = null;
let currentTabId: number | null = null;

async function handleTabSwitch(newTabId: number) {
  if (!isRecording) {
    console.info('Recording is not active, ignoring tab switch');
    return;
  }

  previousTabId = currentTabId;
  currentTabId = newTabId;

  console.info('Tab switch detected - from:', previousTabId, 'to:', currentTabId);

  // Only send tab switch message to the previous tab if it exists and is different
  if (previousTabId && previousTabId !== newTabId) {
    try {
      await sendMessage(MessageType.TabSwitch, undefined, {
        tabId: previousTabId,
      });
      console.info('Tab switch message sent to previous tab:', previousTabId);
    } catch (error) {
      console.info('Could not send tab switch message to previous tab:', previousTabId, error);
    }
  }

  // Send recording start message to the new tab
  if (newTabId) {
    try {
      await sendMessage(MessageType.RecordingStart, undefined, {
        tabId: newTabId,
      });
      console.info('Recording start message sent to new tab:', newTabId);
    } catch (error) {
      console.info('Could not send recording start message to new tab:', newTabId, error);
    }
  }
}

export function registerRecordingHandler() {
  const tabActivatedListener = (tab: any) => {
    handleTabSwitch(tab.tabId);
  };

  browser.tabs.onActivated.addListener(tabActivatedListener);

  onMessage(MessageType.IsRecording, () => ({ isRecording }));

  onMessage(MessageType.RecordingStart, async () => {
    isRecording = true;
    try {
      const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
      if (activeTab[0] && activeTab[0].id) {
        currentTabId = activeTab[0].id;
        console.info(`Starting recording on active tab ${currentTabId}`);
        await sendMessage(MessageType.RecordingStart, undefined, {
          tabId: currentTabId,
        });
      }
    } catch (error) {
      console.error('Failed to start recording on active tab:', error);
    }
  });

  onMessage(MessageType.RecordingStop, async () => {
    isRecording = false;

    if (currentTabId) {
      try {
        console.info(`Stopping recording on current tab ${currentTabId}`);
        await sendMessage(MessageType.RecordingStop, undefined, {
          tabId: currentTabId,
        });
      } catch (error) {
        console.info(`Could not stop recording on tab ${currentTabId}:`, error);
      }
    }

    try {
      if (recordingHistory.length > 0) {
        const sessionId = await indexedDBManager.saveRecordingSession(recordingHistory);
        console.info('Recording session saved with ID:', sessionId);
        recordingHistory.length = 0;
      } else {
        console.info('Recording history is empty');
      }
    } catch (error) {
      console.error('Error saving recording session:', error);
      throw error;
    }
  });

  onMessage(MessageType.RecordingData, async (message) => {
    const { events } = message.data;
    console.info('Received recording data with events:', events.length);

    if (events.length > 0) {
      try {
        const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
        const tabId = activeTab[0]?.id || currentTabId;

        if (tabId) {
          recordingHistory.push({
            tabId: tabId,
            events,
            timestamp: Date.now(),
          });
          console.info('Added events to recording history for tab:', tabId);
          console.info('Recording history:', recordingHistory);
        } else {
          console.error('No valid tab ID found for recording data');
        }
      } catch (error) {
        console.error('Error getting active tab for recording data:', error);
      }
    }

    if (!isRecording && recordingHistory.length > 0) {
      try {
        const sessionId = await indexedDBManager.saveRecordingSession(recordingHistory);
        console.info('Recording session saved with ID:', sessionId);

        console.info('Recording history:', recordingHistory);

        await indexedDBManager.debugListAllSessions();

        recordingHistory.length = 0;
      } catch (error) {
        console.error('Error saving recording session:', error);
        throw error;
      }
    }
  });
}
