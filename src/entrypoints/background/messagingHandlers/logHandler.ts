import { BridgeMessage } from '@/lib/enums/bridge';
import { onMessage } from '@/entrypoints/background/messaging/messaging';

export function registerPopupHandlers() {
  onMessage(BridgeMessage.PopupMessage, (data) => {
    console.info('Received message from popup:', data);
    return { success: true, message: 'Message received and logged!', timestamp: Date.now() };
  });

  onMessage(BridgeMessage.PopupAction, (data) => {
    console.info('Received action from popup:', data);
    if (data && typeof data === 'object' && 'action' in data && typeof data.action === 'string') {
      return { success: true, action: data.action, timestamp: Date.now() };
    }
    return { success: false, error: 'Invalid action data' };
  });
}
