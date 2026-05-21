import { useEffect } from 'react';

const usePageTitle = (titulo) => {
  useEffect(() => {
    document.title = titulo
      ? `${titulo} — EntreLanas`
      : 'EntreLanas — Artesanía tejida a mano';
    return () => {
      document.title = 'EntreLanas — Artesanía tejida a mano';
    };
  }, [titulo]);
};

export default usePageTitle;