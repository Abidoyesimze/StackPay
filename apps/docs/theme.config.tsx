import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>StackPay Docs</span>,
  project: {
    link: 'https://github.com/stackspay/stackspay',
  },
  chat: {
    link: 'https://discord.gg/stackspay',
  },
  docsRepositoryBase: 'https://github.com/stackspay/stackspay/tree/main/apps/docs',
  footer: {
    text: 'StackPay Documentation',
  },
}

export default config
