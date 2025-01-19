import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// We need to read process.env since vite doesn't read
// env files before processing this ocnfig file and the
// meta variables are not available
const buildEnv = process.env.VLABS_BUILD_ENV || 'TEST';

const viteConfig = {
  PROD: {
    // plugins: [dts()],
    build: {
      lib: {
        entry: resolve(__dirname, './src/bug-report.js'),
        name: 'vlabsBugReport`',
        fileName: `vlabs-bug-report`
      }
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'src/bug-report.html',
            dest: 'bug-report.html'
          }
        ]
      })
    ]
  },
  TEST: {
    // plugins: [dts()],
    build: {
      lib: {
        entry: resolve(__dirname, './src/bug-report.js'),
        name: 'vlabsBugReport`',
        fileName: `vlabs-bug-report`,
        base: '/svc-bug-report'
      }
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'src/bug-report.html',
            dest: '.'
          }
        ]
      })
    ]
  },
};

const currentConfig = viteConfig[buildEnv] || viteConfig['TEST'];

export default defineConfig(currentConfig);