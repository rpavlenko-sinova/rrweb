import { type BridgeMessage } from '@/lib/enums/bridge';
import { defineExtensionMessaging } from '@webext-core/messaging';

type TPopupMessageData = {
  message: string;
  timestamp: number;
};

type TPopupMessageResponse = {
  success: boolean;
  message: string;
  timestamp: number;
};

type TPopupActionData = {
  action: string;
  timestamp: number;
};

type TPopupActionResponse = {
  success: boolean;
  action?: string;
  timestamp?: number;
  error?: string;
};

type TStorageGetData = {
  key: string;
};

type TStorageGetResponse = {
  success: boolean;
  key?: string;
  value?: unknown;
  timestamp?: number;
  error?: string;
};

type TStorageSetData = {
  key: string;
  value: string;
};

type TStorageSetResponse = {
  success: boolean;
  key?: string;
  value?: string;
  timestamp?: number;
  error?: string;
};

type TStorageDeleteData = {
  key: string;
};

type TStorageDeleteResponse = {
  success: boolean;
  key?: string;
  message?: string;
  timestamp?: number;
  error?: string;
};

type TPopupProtocol = {
  [BridgeMessage.PopupMessage]: (data: TPopupMessageData) => TPopupMessageResponse;
  [BridgeMessage.PopupAction]: (data: TPopupActionData) => TPopupActionResponse;
  [BridgeMessage.StorageGet]: (data: TStorageGetData) => TStorageGetResponse;
  [BridgeMessage.StorageSet]: (data: TStorageSetData) => TStorageSetResponse;
  [BridgeMessage.StorageDelete]: (data: TStorageDeleteData) => TStorageDeleteResponse;
};

export const { sendMessage, onMessage } = defineExtensionMessaging<TPopupProtocol>();
