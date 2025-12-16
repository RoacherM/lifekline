import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Read OpenAI-style envs from `.env.local` (and keep a few fallbacks for older names).
  const openaiApiKey =
    env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY || env.API_KEY || env.VITE_API_KEY || '';
  const openaiApiBase =
    env.OPENAI_API_BASE ||
    env.OPENAI_API_BASE_URL ||
    env.VITE_OPENAI_API_BASE ||
    env.VITE_OPENAI_API_BASE_URL ||
    env.OPENAI_API_URL ||
    env.VITE_OPENAI_API_URL ||
    env.API_BASE_URL ||
    env.VITE_API_BASE_URL ||
    '';
  const modelName =
    env.MODEL_NAME ||
    env.MODLE_NAME ||
    env.VITE_MODEL_NAME ||
    env.VITE_MODLE_NAME ||
    env.OPENAI_MODEL ||
    env.VITE_OPENAI_MODEL ||
    '';

  return {
    plugins: [react()],
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    define: {
      // Inject envs into the client bundle (note: this exposes the key in the browser build).
      'import.meta.env.OPENAI_API_KEY': JSON.stringify(openaiApiKey),
      'import.meta.env.OPENAI_API_BASE': JSON.stringify(openaiApiBase),
      'import.meta.env.MODEL_NAME': JSON.stringify(modelName),
      // Support the common typo `MODLE_NAME` as well.
      'import.meta.env.MODLE_NAME': JSON.stringify(modelName),

      // Backward compatibility for any existing code using `process.env.API_KEY`.
      'process.env.API_KEY': JSON.stringify(openaiApiKey),
    }
  };
});
