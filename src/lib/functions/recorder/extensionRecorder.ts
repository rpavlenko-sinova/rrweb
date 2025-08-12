import { record } from 'rrweb';
import { type listenerHandler } from '@rrweb/types';

export class ExtensionRecorder {
  private stopFn: listenerHandler | undefined;
  private events: any[];
  private isRecording: boolean;

  constructor() {
    this.stopFn = undefined;
    this.events = [];
    this.isRecording = false;
  }

  startRecording() {
    if (this.isRecording) {
      return;
    }

    this.isRecording = true;
    this.events = [];

    this.stopFn = record({
      emit: (event: any) => {
        this.events.push(event);
      },
      recordCanvas: true,
      collectFonts: true,
      inlineStylesheet: true,
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
      slimDOMOptions: {
        script: true,
        comment: true,
        headFavicon: true,
        headWhitespace: true,
        headMetaDescKeywords: true,
        headMetaSocial: true,
        headMetaRobots: true,
        headMetaHttpEquiv: true,
        headMetaAuthorship: true,
        headMetaVerification: true,
      },
    });
  }

  stopRecording() {
    if (this.stopFn) {
      this.stopFn();
      this.stopFn = undefined;
    }
    this.isRecording = false;
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }

  isCurrentlyRecording() {
    return this.isRecording;
  }
}
