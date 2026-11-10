import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), mdx(), icon({ include: { mdi: ["github", "linkedin"] } })],
  output: "server",
  adapter: vercel(),
});
