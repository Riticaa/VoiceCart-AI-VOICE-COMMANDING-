// Voice Speech Utilities for VoiceCart AI

// Check if SpeechSynthesis is available
export function speakText(text: string, enabled: boolean = true, language: string = 'en-IN') {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // cancel prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Choose appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      (language.startsWith('hi') && (v.lang.includes('hi') || v.name.includes('Hindi'))) ||
      (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export class SpeechRecognitionManager {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN';

        this.recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (this.onResultCallback && currentTranscript) {
            this.onResultCallback(currentTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event.error);
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onEndCallback) {
            this.onEndCallback();
          }
        };
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public setLanguage(lang: string) {
    if (this.recognition) {
      if (lang === 'hi') {
        this.recognition.lang = 'hi-IN';
      } else if (lang === 'ta') {
        this.recognition.lang = 'ta-IN';
      } else if (lang === 'te') {
        this.recognition.lang = 'te-IN';
      } else {
        this.recognition.lang = 'en-IN';
      }
    }
  }

  public startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser. You can type or use the quick test buttons!');
      return false;
    }

    try {
      this.onResultCallback = onResult;
      this.onErrorCallback = onError;
      this.onEndCallback = onEnd;
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Recognition start exception:', err);
      this.isListening = false;
      onError(err.message || 'Could not start microphone.');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const speechManager = new SpeechRecognitionManager();
