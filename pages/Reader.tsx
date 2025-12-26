
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Book, ReaderMode, BookProgress } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';
import { usePdf } from '../hooks/usePdf';
import { useAudioNarration } from '../hooks/useAudioNarration';
import { padPageNumber } from '../utils/padPageNumber';
import PdfPageCanvas from '../components/PdfPageCanvas';
import ReaderControls from '../components/ReaderControls';
import AudioControls from '../components/AudioControls';
import { PartyPopper } from 'lucide-react';

const Reader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = (searchParams.get('mode') as ReaderMode) || ReaderMode.MANUAL;
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [book, setBook] = useState<Book | null>(null);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  // Load Book metadata
  useEffect(() => {
    fetch('/books/books.json')
      .then(res => res.json())
      .then((data: Book[]) => {
        const found = data.find(b => b.id === id);
        if (found) setBook(found);
        else {
           setBook({
            id: id || 'demo',
            title: "Lily’s Forest Adventure",
            description: "Join Lily as she explores the magical whispering woods.",
            pdf: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
            cover: "https://picsum.photos/seed/lily/400/600",
            audioPattern: "/books/demo/audio/{page}.mp3",
            audioPad: 3
          });
        }
      });
  }, [id]);

  const { pdf, numPages, loading, error } = usePdf(book?.pdf || '');

  // Save Progress
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const allProgress = saved ? JSON.parse(saved) : {};
      allProgress[id] = { lastPage: currentPage, mode } as BookProgress;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
    }
  }, [id, currentPage, mode]);

  // Audio URL
  const audioUrl = useMemo(() => {
    if (!book || mode !== ReaderMode.NARRATED) return null;
    const padded = padPageNumber(currentPage, book.audioPad);
    return book.audioPattern.replace('{page}', padded).replace('{id}', book.id);
  }, [book, currentPage, mode]);

  const handleNext = useCallback(() => {
    if (currentPage < numPages) {
      setCurrentPage(prev => prev + 1);
      setShowEndOverlay(false);
    } else {
      setShowEndOverlay(true);
    }
  }, [currentPage, numPages]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setShowEndOverlay(false);
    }
  }, [currentPage]);

  const { isPlaying, progress, error: audioError, isMuted, togglePlay, toggleMute, replay } = useAudioNarration({
    url: audioUrl,
    autoPlay: mode === ReaderMode.NARRATED,
    onEnded: () => {
      if (mode === ReaderMode.NARRATED) {
        if (currentPage < numPages) {
          handleNext();
        } else {
          setShowEndOverlay(true);
        }
      }
    }
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleNext, handlePrev]);

  const handleExit = () => {
    navigate(`/book/${id}`);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-xl font-bold text-blue-600">Opening your storybook...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oh no! We couldn't open the book.</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-neutral-900 overflow-hidden relative flex flex-col items-center justify-center">
      {/* Narrative Audio UI */}
      {mode === ReaderMode.NARRATED && (
        <AudioControls 
          isPlaying={isPlaying}
          isMuted={isMuted}
          progress={progress}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onReplay={replay}
          disabled={showEndOverlay}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex items-center justify-center z-0">
        <div className="relative w-full h-full flex items-center justify-center group">
           <PdfPageCanvas 
            pdf={pdf} 
            pageNumber={currentPage} 
            className="shadow-2xl transition-all duration-500"
          />
        </div>
      </div>

      {/* Manual Reader Controls */}
      <ReaderControls 
        currentPage={currentPage}
        totalPages={numPages}
        onPrev={handlePrev}
        onNext={handleNext}
        onExit={handleExit}
        onFullscreen={handleToggleFullscreen}
      />

      {/* End of Book Overlay */}
      {showEndOverlay && (
        <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-white">
          <PartyPopper size={80} className="text-yellow-400 mb-6 animate-bounce" />
          <h2 className="text-5xl font-bold mb-4 text-center">THE END</h2>
          <p className="text-2xl mb-12 text-center opacity-90">You did a great job reading!</p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
             <button 
              onClick={() => {
                setCurrentPage(1);
                setShowEndOverlay(false);
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-2xl text-xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              Read again
            </button>
            <button 
              onClick={handleExit}
              className="flex-1 bg-white hover:bg-gray-100 text-blue-900 py-4 px-8 rounded-2xl text-xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              Back to library
            </button>
          </div>
        </div>
      )}

      {/* Missing Audio Warning (discreet) */}
      {mode === ReaderMode.NARRATED && audioError && !showEndOverlay && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-medium border border-yellow-200">
          Audio for this page is coming soon!
        </div>
      )}
    </div>
  );
};

export default Reader;
