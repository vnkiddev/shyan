
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { APP_NAME } from '../constants';
import { BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/books/books.json')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load books.json', err);
        setLoading(false);
        // Fallback dummy data for demo
        setBooks([
          {
            id: 'sandy-super-saturn',
            title: "Sandy’s Super Saturn Day",
            description: "A fun adventure on Saturn with high-flying rings and alien friends!",
            pdf: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
            cover: "https://picsum.photos/seed/sandy/400/600",
            audioPattern: "/books/sandy-super-saturn/audio/{page}.mp3",
            audioPad: 3
          }
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-blue-600 text-white py-12 px-4 shadow-lg text-center rounded-b-[40px] mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">
          {APP_NAME}
        </h1>
        <p className="text-xl md:text-2xl opacity-90">Pick a story and let's go on an adventure!</p>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-bounce text-blue-500 font-bold text-2xl">Loading stories...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map(book => (
              <Link 
                key={book.id} 
                to={`/book/${book.id}`}
                className="group block bg-white rounded-[32px] overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-transparent hover:border-yellow-400"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 p-2 rounded-full shadow-md">
                    <BookOpen size={24} />
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
                  <p className="text-gray-600 line-clamp-2">{book.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
