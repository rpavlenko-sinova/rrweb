import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { indexedDBManager, type TRecordingSession } from '@/lib/functions/database';
import { Replayer } from 'rrweb';
import '@/styles/global.css';

const Options: React.FC = () => {
  const [sessions, setSessions] = useState<TRecordingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<TRecordingSession | null>(null);
  const [replayerContainer, setReplayerContainer] = useState<HTMLDivElement | null>(null);
  const [replayerInstance, setReplayerInstance] = useState<Replayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Refs for tracking playback
  const playbackStartTimeRef = useRef<number>(0);
  const playbackStartPositionRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  // Update current time periodically when playing
  useEffect(() => {
    if (isPlaying && replayerInstance) {
      // Start tracking playback time
      playbackStartTimeRef.current = Date.now();
      playbackStartPositionRef.current = currentTime;

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - playbackStartTimeRef.current;
        const newCurrentTime = playbackStartPositionRef.current + elapsed * playbackSpeed;

        if (newCurrentTime <= totalTime) {
          setCurrentTime(newCurrentTime);
        } else {
          // Reached the end
          setCurrentTime(totalTime);
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 100);
    } else {
      // Stop tracking
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, replayerInstance, playbackSpeed, totalTime]);

  const loadSessions = async () => {
    try {
      const allSessions = await indexedDBManager.getAllRecordingSessions();
      setSessions(allSessions.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleSessionSelect = (session: TRecordingSession) => {
    setSelectedSession(session);
    setReplayerInstance(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setTotalTime(0);
    setPlaybackSpeed(1);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleReplay = () => {
    if (!selectedSession || !replayerContainer) {
      return;
    }

    replayerContainer.innerHTML = '';

    replayerContainer.style.width = '100%';
    replayerContainer.style.height = '600px';
    replayerContainer.style.overflow = 'auto';
    replayerContainer.style.border = '1px solid #ccc';

    const events = selectedSession.recordingHistory.flatMap((item) => item.events);

    if (events.length === 0) {
      replayerContainer.innerHTML = '<p>No events to replay</p>';
      return;
    }

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const totalDuration = lastEvent.timestamp - firstEvent.timestamp;
    setTotalTime(totalDuration);

    const replayer = new Replayer(events, {
      root: replayerContainer,
      speed: playbackSpeed,
      showWarning: false,
      blockClass: 'rr-block',
      liveMode: false,
      insertStyleRules: [],
      triggerFocus: false,
      showDebug: true,
      UNSAFE_replayCanvas: true,
      pauseAnimation: true,
      mouseTail: true,
    });

    setReplayerInstance(replayer);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!replayerInstance) {
      return;
    }

    if (isPlaying) {
      replayerInstance.pause();
      setIsPlaying(false);
    } else {
      replayerInstance.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (!replayerInstance) {
      return;
    }

    setPlaybackSpeed(speed);

    // Update the replayer speed by recreating it
    const events = selectedSession?.recordingHistory.flatMap((item) => item.events) || [];
    if (events.length > 0 && replayerContainer) {
      replayerContainer.innerHTML = '';

      const replayer = new Replayer(events, {
        root: replayerContainer,
        speed: speed,
        showWarning: false,
        blockClass: 'rr-block',
        liveMode: false,
        insertStyleRules: [],
        triggerFocus: false,
        showDebug: true,
        UNSAFE_replayCanvas: true,
        pauseAnimation: true,
        mouseTail: true,
      });

      setReplayerInstance(replayer);

      // If currently playing, restart playback
      if (isPlaying) {
        replayer.play();
        // Reset the playback tracking
        playbackStartTimeRef.current = Date.now();
        playbackStartPositionRef.current = currentTime;
      }
    }
  };

  const handleSeek = (time: number) => {
    if (!replayerInstance || !selectedSession) {
      return;
    }

    setCurrentTime(time);

    // Reset playback tracking for the new position
    playbackStartTimeRef.current = Date.now();
    playbackStartPositionRef.current = time;

    console.info('Seeking to time:', time, 'in session:', selectedSession.id);

    // For proper seeking, we'd need to find the event closest to this time
    // and restart the replayer from that point. This is a simplified version.
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-100 p-4">
        <h2 className="mb-4 text-lg font-bold">Sessions</h2>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`cursor-pointer rounded border p-3 ${
                selectedSession?.id === session.id ? 'border-blue-300 bg-blue-100' : 'bg-white'
              }`}
              onClick={() => handleSessionSelect(session)}
            >
              <div className="font-medium">Session {session.id.slice(-6)}</div>
              <div className="text-sm text-gray-500">{new Date(session.timestamp).toLocaleString()}</div>
              <div className="text-xs text-gray-400">
                {session.recordingHistory.length} tabs,{' '}
                {session.recordingHistory.reduce((sum, item) => sum + item.events.length, 0)} events
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        {selectedSession ? (
          <div>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-bold">Replaying Session {selectedSession.id.slice(-6)}</h3>
              <button
                onClick={handleReplay}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Load Replay
              </button>
            </div>

            {!!replayerInstance && (
              <div className="mb-4 space-y-4 rounded border bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePlayPause}
                      className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Speed:</span>
                      {[0.25, 0.5, 1, 1.5, 2, 4].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`rounded px-2 py-1 text-xs ${
                            playbackSpeed === speed
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {formatTime(currentTime)} / {formatTime(totalTime)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Timeline</span>
                    <span>{totalTime > 0 ? Math.round((currentTime / totalTime) * 100) : 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalTime}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full"
                    disabled={!replayerInstance}
                  />
                </div>
              </div>
            )}

            <div ref={setReplayerContainer} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">Select a session to replay</div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
