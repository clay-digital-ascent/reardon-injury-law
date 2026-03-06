import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://reardoninjurylaw.com",
  output: "static",
  integrations: [sitemap()],
});
