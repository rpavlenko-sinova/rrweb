import { BridgeMessage } from '@/lib/enums/bridge';
import { storage } from '#imports';
import { onMessage } from '@/entrypoints/background/messaging/messaging';

// documentation on storage: https://wxt.dev/storage.html

export function registerStorageHandlers() {
  onMessage(BridgeMessage.StorageGet, async (data) => {
    try {
      if (typeof data !== 'object' || !data || (data && !('key' in data))) {
        return { success: false, error: 'Invalid key provided' };
      }

      const key = data.key as string;
      console.info('Getting storage value for key:', key);

      // local: is a prefix for the storage key
      const value = await storage.getItem(`local:${key}`);

      return {
        success: true,
        key,
        value,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error getting storage value:', error);
      return {
        success: false,
        error: `Failed to get storage value: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  });

  onMessage(BridgeMessage.StorageSet, async (data) => {
    try {
      console.info('Setting storage value:', data);

      if (typeof data !== 'object' || !data || (data && !('key' in data)) || (data && !('value' in data))) {
        return { success: false, error: 'Invalid data provided. Need key and value.' };
      }

      if (typeof data.value !== 'string' || typeof data.key !== 'string') {
        return { success: false, error: 'Invalid data provided. Need key and value.' };
      }

      const { key, value } = data;
      await storage.setItem(`local:${key}`, value);

      return {
        success: true,
        key,
        value,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error setting storage value:', error);
      return {
        success: false,
        error: `Failed to set storage value: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  });

  onMessage(BridgeMessage.StorageDelete, async (data) => {
    try {
      if (typeof data !== 'object' || !data || (data && !('key' in data))) {
        return { success: false, error: 'Invalid key provided' };
      }

      const key = data.key as string;
      await storage.removeItem(`local:${key}`);

      return {
        success: true,
        key,
        message: 'Storage value deleted successfully',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error deleting storage value:', error);
      return {
        success: false,
        error: `Failed to delete storage value: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  });
}
