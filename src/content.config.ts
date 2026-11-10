import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    // tags: z.array(z.string()),
    images: z.object({
      cover: z.string(),
      article: z.array(z.string()).optional(),
    }),
    date: z.string(),
    excerpt: z.string().max(190),
  }),
});

export const collections = {
  posts: postsCollection,
};
