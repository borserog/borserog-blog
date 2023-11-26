// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// 2. Define a `type` and `schema` for each collection
// TODO translate this schema to the CMS solution
const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    // tags: z.array(z.string()),
    images: z.object({
      cover: z.string(),
      article: z.array(z.string()).optional(),
    }),
    date: z.string(),
    excerpt: z.string().max(140),
  }),
});
export type Post = z.infer<typeof postsCollection>;

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
};
