
import React, { useRef, useEffect, useState } from 'react';

interface PdfPageCanvasProps {
  pdf: any;
  pageNumber: number;
  className?: string;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({ pdf, pageNumber, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: any = null;

    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;
      setLoading(true);

      try {
        const page = await pdf.getPage(pageNumber);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        canvas.height = viewport.height * dpr;
        canvas.width = viewport.width * dpr;
        canvas.style.height = `${viewport.height}px`;
        canvas.style.width = `${viewport.width}px`;

        if (context) {
          context.scale(dpr, dpr);
          renderTask = page.render({
            canvasContext: context,
            viewport: viewport,
          });
          await renderTask.promise;
          if (!isCancelled) setLoading(false);
        }
      } catch (err) {
        console.error('Error rendering page:', err);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdf, pageNumber]);

  return (
    <div className={`relative flex justify-center items-center overflow-hidden rounded-lg shadow-xl bg-white ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full h-auto block mx-auto" />
    </div>
  );
};

export default PdfPageCanvas;
