import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import dotenv from 'dotenv';

dotenv.config();

manifest.oauth2.client_id = process.env.SPOTIFY_CLIENT_ID!;
manifest.oauth2.redirect_uri = `https://${process.env.VITE_EXTENSION_ID}.chromiumapp.org/`;

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],

})