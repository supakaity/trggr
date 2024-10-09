import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: 'custom-hook',
      buildStart() {
        // Your custom build hook logic here
      },
    },
  ],
});