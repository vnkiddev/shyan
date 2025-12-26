
import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onReplay: () => void;
  disabled?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isMuted,
  progress,
  onTogglePlay,
  onToggleMute,
  onReplay,
  disabled
}) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl pointer-events-auto flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          disabled={disabled}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors disabled:bg-gray-300"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onReplay}
          disabled={disabled}
          className="text-gray-600 hover:text-orange-500 p-1 rounded transition-colors disabled:text-gray-300"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={onToggleMute}
          disabled={disabled}
          className="text-gray-600 hover:text-orange-500 p-1 rounded transition-colors disabled:text-gray-300"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default AudioControls;
