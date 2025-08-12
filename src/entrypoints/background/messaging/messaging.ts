import { defineExtensionMessaging } from '@webext-core/messaging';
import { type MessageType } from '@/lib/enums/messages';
import { type eventWithTime } from '@rrweb/types';

export type TIsRecordingResponse = {
  isRecording: boolean;
};

export type TRecordingDataRequest = {
  events: eventWithTime[];
};

type TProtocolMap = {
  [MessageType.IsRecording]: () => TIsRecordingResponse;
  [MessageType.RecordingStart]: () => void;
  [MessageType.RecordingStop]: (request?: TRecordingDataRequest) => void;
  [MessageType.RecordingData]: TRecordingDataRequest;
  [MessageType.TabSwitch]: void;
};

export const { sendMessage, onMessage } = defineExtensionMessaging<TProtocolMap>({});
