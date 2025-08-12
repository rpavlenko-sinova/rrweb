export type TRecordingSession = {
  id: string;
  timestamp: number;
  recordingHistory: {
    tabId: number;
    events: any[];
    timestamp: number;
  }[];
};

class IndexedDBManager {
  private dbName = 'RRWebRecorderDB';
  private dbVersion = 1;
  private storeName = 'recordingSessions';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveRecordingSession(recordingHistory: TRecordingSession['recordingHistory']): Promise<string> {
    if (!this.db) {
      console.info('Initializing IndexedDB...');
      await this.init();
    }

    if (recordingHistory.length === 0) {
      throw new Error('Recording history is empty');
    }

    const session: TRecordingSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      recordingHistory,
    };

    console.info(
      'Attempting to save session to IndexedDB:',
      session.id,
      'with',
      recordingHistory.length,
      'history items',
    );

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(session);

      request.onsuccess = () => {
        console.info('IndexedDB save successful for session:', session.id);
        resolve(session.id);
      };

      request.onerror = (event) => {
        console.error('IndexedDB save failed:', event);
        console.error('Error details:', request.error);
        reject(new Error('Failed to save recording session'));
      };

      // Add transaction event handlers
      transaction.oncomplete = () => {
        console.info('IndexedDB transaction completed for session:', session.id);
      };

      transaction.onerror = (event) => {
        console.error('IndexedDB transaction error:', event);
      };

      transaction.onabort = (event) => {
        console.error('IndexedDB transaction aborted:', event);
      };
    });
  }

  async getRecordingSession(id: string): Promise<TRecordingSession | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve recording session'));
      };
    });
  }

  async getAllRecordingSessions(): Promise<TRecordingSession[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve recording sessions'));
      };
    });
  }

  async deleteRecordingSession(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete recording session'));
      };
    });
  }

  async clearAllSessions(): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear recording sessions'));
      };
    });
  }

  async debugListAllSessions(): Promise<void> {
    try {
      console.info('Debug: Listing all sessions in IndexedDB...');
      const sessions = await this.getAllRecordingSessions();
      console.info('Debug: Found', sessions.length, 'sessions in IndexedDB:');
      sessions.forEach((session, index) => {
        console.info(`Debug: Session ${index + 1}:`, {
          id: session.id,
          timestamp: session.timestamp,
          historyItems: session.recordingHistory.length,
          totalEvents: session.recordingHistory.reduce((sum, item) => sum + item.events.length, 0),
        });
      });
    } catch (error) {
      console.error('Debug: Error listing sessions:', error);
    }
  }
}

export const indexedDBManager = new IndexedDBManager();
