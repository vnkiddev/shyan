
import { useState, useEffect, useCallback } from 'react';

export interface PdfState {
  numPages: number;
  pdf: any | null;
  loading: boolean;
  error: string | null;
}

export const usePdf = (url: string) => {
  const [state, setState] = useState<PdfState>({
    numPages: 0,
    pdf: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const loadPdf = async () => {
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        // @ts-ignore
        const loadingTask = window.pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        if (!isCancelled) {
          setState({
            pdf,
            numPages: pdf.numPages,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!isCancelled) {
          setState(s => ({ ...s, loading: false, error: 'Failed to load PDF' }));
          console.error(err);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return state;
};
