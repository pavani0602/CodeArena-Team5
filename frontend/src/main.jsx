import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './i18n';

// Swap this with your actual Client ID from Google Cloud Console when ready!
const GOOGLE_CLIENT_ID = "708164976846-ct35j10iohqoij0sig19cfhcmi0dgkvd.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
// render changes the content of root, render decides how ui should look.