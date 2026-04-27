import { useEffect } from 'react';

export default function Demo() {
  useEffect(() => {
    // Redirect to the static demo-byok.html page
    window.location.href = '/demo-byok.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
        <p className="text-slate-600">Loading BYOK Demo...</p>
      </div>
    </div>
  );
}
