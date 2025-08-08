import { useState } from 'react';

import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import '@/entrypoints/popup/App.css';
import { Button } from '@/components/ui/button';
import { BridgeMessage } from '@/lib/enums/bridge';
import { sendMessage } from '@/entrypoints/background/messaging/messaging';

export const App = () => {
  const [count, setCount] = useState(0);
  const [messageStatus, setMessageStatus] = useState<string>('');

  const sendMessageToBackground = async () => {
    try {
      const response = await sendMessage(BridgeMessage.PopupMessage, {
        message: `Hello from popup! Count is ${count}`,
        timestamp: Date.now(),
      });

      if (response && typeof response === 'object' && 'message' in response) {
        setMessageStatus(
          `Message sent successfully: ${response.message && typeof response.message === 'string' ? response.message : `response value is not defined or an object ${JSON.stringify(response)}`}`,
        );
      } else {
        setMessageStatus('Message sent successfully');
      }
      console.info('Response from background:', response);
    } catch (error) {
      setMessageStatus(
        `Error sending message: ${error && typeof error === 'string' ? error : `error value is not defined or an object ${JSON.stringify(error)}`}`,
      );
      console.error('Error sending message:', error);
    }
  };

  const sendActionToBackground = async (action: string) => {
    try {
      const response = await sendMessage(BridgeMessage.PopupAction, {
        action,
        timestamp: Date.now(),
      });

      if (response && typeof response === 'object' && 'action' in response) {
        setMessageStatus(
          `Action sent successfully: ${response.action && typeof response.action === 'string' ? response.action : `response value is not defined or an object ${JSON.stringify(response)}`}`,
        );
      } else {
        setMessageStatus('Action sent successfully');
      }
      console.info('Response from background:', response);
    } catch (error) {
      setMessageStatus(
        `Error sending action: ${error && typeof error === 'string' ? error : `error value is not defined or an object ${JSON.stringify(error)}`}`,
      );
      console.error('Error sending action:', error);
    }
  };

  const getStorageValue = async () => {
    try {
      const response = await sendMessage(BridgeMessage.StorageGet, {
        key: BridgeMessage.StorageGet,
      });
      console.info('Response from background:', response);
    } catch (error) {
      console.error('Error sending action:', error);
    }
  };

  const setStorageValue = async (value: string) => {
    try {
      const response = await sendMessage(BridgeMessage.StorageSet, {
        key: BridgeMessage.StorageSet,
        value,
      });
      console.info('Response from background:', response);
    } catch (error) {
      console.error('Error sending action:', error);
    }
  };

  return (
    <>
      <div>
        <a
          href="https://wxt.dev"
          target="_blank"
        >
          <img
            src={wxtLogo}
            className="logo"
            alt="WXT logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
        >
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR 12345
        </p>

        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <Button
            onClick={sendMessageToBackground}
            style={{ padding: '8px 16px' }}
          >
            Send Message to Background
          </Button>
          <Button
            onClick={() => sendActionToBackground('increment')}
            style={{ padding: '8px 16px' }}
          >
            Send Increment Action
          </Button>
          <Button
            onClick={() => sendActionToBackground('reset')}
            style={{ padding: '8px 16px' }}
          >
            Send Reset Action
          </Button>
          <Button
            onClick={() => getStorageValue()}
            style={{ padding: '8px 16px' }}
          >
            Get Storage Value
          </Button>
          <Button
            onClick={() => setStorageValue('test')}
            style={{ padding: '8px 16px' }}
          >
            Set Storage Value
          </Button>
        </div>

        {!!messageStatus && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: messageStatus.includes('Error') ? '#ffebee' : '#e8f5e8',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            {messageStatus}
          </div>
        )}
      </div>
      <p className="read-the-docs">Click on the WXT and React logos to learn more</p>
    </>
  );
};
