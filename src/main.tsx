import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '../src/App'
import { Toaster } from 'sonner'
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Toaster position="top-center" richColors />
      <App />
    </StrictMode>,
  );
}
