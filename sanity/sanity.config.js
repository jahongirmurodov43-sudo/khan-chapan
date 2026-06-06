import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import menuItem from './schemas/menuItem';
import event from './schemas/event';

export default defineConfig({
  name: 'khan-chapan',
  title: 'Khan Chapan CMS',

  // ⚠️  Replace with your actual Sanity project ID from sanity.io/manage
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [menuItem, event],
  },
});
