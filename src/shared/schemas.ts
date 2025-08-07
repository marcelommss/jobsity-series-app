import { z } from 'zod';

export const ImageSchema = z.object({
  medium: z.string(),
  original: z.string(),
}).nullable().optional();

export const SeriesScheduleSchema = z.object({
  time: z.string(),
  days: z.array(z.string()),
}).nullable().optional();

export const NetworkSchema = z.object({
  name: z.string(),
  country: z.object({
    name: z.string(),
    code: z.string(),
  }),
}).nullable().optional();

export const RatingSchema = z.object({
  average: z.number().nullable(),
}).nullable().optional();

export const SeriesSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  image: ImageSchema,
  genres: z.array(z.string()).nullable().optional(),
  premiered: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  schedule: SeriesScheduleSchema,
  status: z.string().nullable().optional(),
  rating: RatingSchema,
  network: NetworkSchema,
});

export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  season: z.number(),
  number: z.number(),
  summary: z.string().nullable().optional(),
  image: ImageSchema,
  airdate: z.string().nullable().optional(),
  runtime: z.number().nullable().optional(),
});

export const SeriesArraySchema = z.array(SeriesSchema);
export const EpisodeArraySchema = z.array(EpisodeSchema);

export const SearchResultSchema = z.object({
  show: SeriesSchema,
});

export const SearchResultsSchema = z.array(SearchResultSchema);

export type SeriesValidated = z.infer<typeof SeriesSchema>;
export type EpisodeValidated = z.infer<typeof EpisodeSchema>;