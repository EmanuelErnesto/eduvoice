import '@testing-library/jest-dom';

declare const jest: any;

Object.defineProperty(window, 'AudioContext', {
  value: class {
    createGain = () => ({
      connect: jest.fn(),
      gain: { value: 0, setTargetAtTime: jest.fn(), setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() }
    });
    createOscillator = () => ({
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      type: '',
      frequency: { value: 0, setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
      detune: { value: 0 }
    });
    resume = jest.fn().mockResolvedValue(undefined);
    state = 'suspended';
    currentTime = 0;
    destination = {};
  }
});

Object.defineProperty(window, 'location', {
  configurable: true,
  value: { reload: jest.fn() },
});

jest.mock('./services/audioService', () => ({
  audioService: {
    initialize: jest.fn(),
    startAmbientMusic: jest.fn(),
    setMusicVolume: jest.fn(),
    playSFX: jest.fn(),
  }
}));

jest.mock('./services/ttsService', () => ({
  ttsService: {
    init: jest.fn(),
    speak: jest.fn().mockResolvedValue(undefined),
    cancel: jest.fn(),
  }
}));