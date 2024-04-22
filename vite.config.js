import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  ,
  server: {
    port: 9080,
    open: true,
    proxy: {
      '/api/bmdt/szyw/':{//获取路径中包含了/api的请求
        target:'https://wlt.hubei.gov.cn',//后台服务所在的源
        changeOrigin:true,//修改源
        rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
      },
      '/api': {//获取路径中包含了/api的请求
        //112.124.58.63
        target: 'http://112.124.58.63:8090',//后台服务所在的源
        changeOrigin: true,//修改源
        rewrite: (path) => path.replace(/^\/api/, '')///api替换为''
      },
    }
  }
})
