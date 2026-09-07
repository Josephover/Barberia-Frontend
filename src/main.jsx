import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './styles.css'
import { Toaster } from 'react-hot-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#201F22',
              color: '#EDE7DA',
              border: '1px solid #39373A',
              fontFamily: "'Work Sans', sans-serif",
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#7FAE88', secondary: '#201F22' },
            },
            error: {
              iconTheme: { primary: '#D08B8B', secondary: '#201F22' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)