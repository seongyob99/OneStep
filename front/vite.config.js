import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//추가
import path from 'path';
//추가
import { fileURLToPath } from 'url';
// __dirname 대체
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-virtualized': 'react-virtualized/dist/umd/react-virtualized.js',
      // src/styles를 간단히 import하기 위한 alias
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'mixed-decls',
          'color-functions',
          'global-builtin',
          'import',
        ],
      },
    },
  },
})
