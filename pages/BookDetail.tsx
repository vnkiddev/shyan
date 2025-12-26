
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Book, ReaderMode, BookProgress } from '../types';
import { LOCAL_STORAGE_KEY } from '../constants';
import { ArrowLeft, User, Volume2, RotateCcw } from 'lucide-react';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState<BookProgress | null>(null);

  useEffect(() => {
    fetch('/books/books.json')
      .then(res => res.json())
      .then((data: Book[]) => {
        const found = data.find(b => b.id === id);
        if (found) setBook(found);
        else {
           // Fallback demo book
           setBook({
            id: id || 'demo',
            title: "Lily’s Forest Adventure",
            description: "Join Lily as she explores the magical whispering woods and meets curious new friends.",
            pdf: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
            cover: "https://picsum.photos/seed/lily/400/600",
            audioPattern: "/books/demo/audio/{page}.mp3",
            audioPad: 3
          });
        }
      });

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const allProgress = JSON.parse(saved);
      if (id && allProgress[id]) {
        setProgress(allProgress[id]);
      }
    }
  }, [id]);

  if (!book) return null;

  const handleStart = (mode: ReaderMode, continueProgress: boolean = false) => {
    const page = continueProgress && progress ? progress.lastPage : 1;
    navigate(`/reader/${book.id}?mode=${mode}&page=${page}`);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Library
        </Link>

        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img 
              src={book.cover} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {book.description}
            </p>

            {progress && (
              <div className="mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-bold">Great progress!</p>
                  <p className="text-green-600">You stopped at page {progress.lastPage}</p>
                </div>
                <button 
                  onClick={() => handleStart(progress.mode, true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Continue
                </button>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <button 
                onClick={() => handleStart(ReaderMode.MANUAL)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-[24px] text-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
              >
                <User size={28} />
                Read by myself
              </button>
              
              <button 
                onClick={() => handleStart(ReaderMode.NARRATED)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-[24px] text-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg shadow-orange-200"
              >
                <Volume2 size={28} />
                Read to me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
