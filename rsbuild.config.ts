import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl'
import fs from 'node:fs'

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'SOSD',
    favicon: './src/assets/logo.png',
    meta: {
      description: 'a system for lab management',
    },
  },
})
