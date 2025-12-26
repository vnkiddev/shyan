
import React from 'react';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';

interface ReaderControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  onFullscreen: () => void;
}

const ReaderControls: React.FC<ReaderControlsProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onExit,
  onFullscreen
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none flex flex-col gap-4">
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full pointer-events-auto">
        <button
          onClick={onExit}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95"
          aria-label="Exit Reader"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <button
            onClick={onPrev}
            disabled={currentPage <= 1}
            className="text-blue-600 disabled:text-gray-400 p-2 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft size={32} />
          </button>
          
          <span className="text-lg font-bold text-gray-700 min-w-[100px] text-center">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={onNext}
            disabled={currentPage >= totalPages}
            className="text-blue-600 disabled:text-gray-400 p-2 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        <button
          onClick={onFullscreen}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95"
          aria-label="Toggle Fullscreen"
        >
          <Maximize size={24} />
        </button>
      </div>
    </div>
  );
};

export default ReaderControls;
