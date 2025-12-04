
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioControls } from '../AudioControls';
import { useAudio } from '../../contexts/AudioContext';

// Mock the context hook since AudioControls uses it internally
jest.mock('../../contexts/AudioContext', () => ({
  useAudio: jest.fn()
}));

declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;

describe('AudioControls Component', () => {
  const mockConfig = {
    musicVolume: 0.3,
    voiceVolume: 1.0,
    isMuted: false,
    activeTrack: 'cosmos' as const,
    customFileBlobUrl: '',
    customFileName: ''
  };

  const mockUpdateConfig = jest.fn();
  const mockToggleMute = jest.fn();
  const mockSetVolume = jest.fn();
  const mockPlayTrack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAudio as any).mockReturnValue({
      config: mockConfig,
      updateConfig: mockUpdateConfig,
      toggleMute: mockToggleMute,
      setVolume: mockSetVolume,
      playTrack: mockPlayTrack
    });
  });

  it('renders settings button correctly', () => {
    render(<AudioControls />);
    const button = screen.getByLabelText('Configurações de Áudio');
    expect(button).toBeInTheDocument();
  });

  it('opens panel and toggles mute', () => {
    render(<AudioControls />);
    
    // Open panel
    const settingsBtn = screen.getByLabelText('Configurações de Áudio');
    fireEvent.click(settingsBtn);

    // Find Mute button inside panel
    const muteButton = screen.getByText('Mutar Tudo');
    expect(muteButton).toBeInTheDocument();

    fireEvent.click(muteButton);
    expect(mockToggleMute).toHaveBeenCalled();
  });

  it('shows unmute button when muted', () => {
    (useAudio as any).mockReturnValue({
      config: { ...mockConfig, isMuted: true },
      updateConfig: mockUpdateConfig,
      toggleMute: mockToggleMute,
      setVolume: mockSetVolume,
      playTrack: mockPlayTrack
    });
    
    render(<AudioControls />);
    
    const settingsBtn = screen.getByLabelText('Configurações de Áudio');
    fireEvent.click(settingsBtn);
    
    const unmuteButton = screen.getByText('Desmutar Tudo');
    expect(unmuteButton).toBeInTheDocument();
  });
});
