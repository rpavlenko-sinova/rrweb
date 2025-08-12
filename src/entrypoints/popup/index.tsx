import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/components/ui/button';
import { sendMessage } from '@/entrypoints/background/messaging/messaging';
import { MessageType } from '@/lib/enums/messages';
import '@/styles/global.css';

const Popup: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current recording state on mount
    const checkRecordingState = async () => {
      try {
        const response = await sendMessage(MessageType.IsRecording);
        setIsRecording(response.isRecording);
      } catch (error) {
        console.error('Failed to check recording state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkRecordingState();
  });

  const handleStartRecording = () => {
    setIsLoading(true);
    sendMessage(MessageType.RecordingStart)
      .then(() => {
        setIsRecording(true);
      })
      .catch((error) => {
        console.error('Failed to start recording:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStopRecording = () => {
    setIsLoading(true);
    sendMessage(MessageType.RecordingStop)
      .then(() => {
        setIsRecording(false);
      })
      .catch((error) => {
        console.error('Failed to stop recording:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOpenOptions = () => {
    browser.tabs.create({
      url: browser.runtime.getURL('/options.html'),
    });
  };

  return (
    <div className="w-96 bg-white p-4">
      <h1 className="mb-4 text-center text-lg font-bold">RRWeb Recorder</h1>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              if (isRecording) {
                handleStopRecording();
              } else {
                handleStartRecording();
              }
            }}
            disabled={isLoading}
            className={`flex-1 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {!!isLoading && 'Loading...'}
            {!!isRecording && !isLoading ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleOpenOptions}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Options
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          {!!isLoading && <span className="text-blue-500">● Loading...</span>}
          {!isLoading && !!isRecording && <span className="text-red-500">● Recording...</span>}
          {!isLoading && !isRecording && <span className="text-gray-500">● Ready</span>}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
