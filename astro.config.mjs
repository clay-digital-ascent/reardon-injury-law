import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://reardon-injury-law.vercel.app",
  output: "static",
  integrations: [sitemap()],
});
