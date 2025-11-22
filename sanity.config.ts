import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { markdownSchema } from 'sanity-plugin-markdown'
import { schemas } from './sanity/schemas'

export default defineConfig({
  name: 'smartlock-cms',
  title: 'Smart Lock Content Hub',

  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    deskTool(),
    visionTool(),
    markdownSchema(),
  ],

  schema: {
    types: schemas,
  },
})
