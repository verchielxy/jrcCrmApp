import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni'
import {fileURLToPath, URL} from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      uni(),
    ],
    envPrefix: ['VITE', 'VUE'], // 环境变量前缀
    optimizeDeps: {
      exclude: ['dingtalk-jsapi'],
    },
    build: {
      outDir: 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    server: {
      port: 3301,
      host: '0.0.0.0',
      hmr: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      },
      // Vite建议引入时不要忽略.vue扩展名
      // 虽然可以通过配置解决, 但建议老老实实在引入时填写完整的文件名才是正道
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    define: {
      __SERVER_URL__: JSON.stringify(env.VITE_API_URL)
    },
  }
})
