import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    category: z.string(),
    author: z.string().default("Reardon Injury Law"),
  }),
});

const cities = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    city: z.string(),
    county: z.string(),
    metaDescription: z.string(),
    population: z.string().optional(),
    dangerousAreas: z.array(z.string()).optional(),
    hospitals: z.array(z.string()).optional(),
    courthouse: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = { blog, cities };
