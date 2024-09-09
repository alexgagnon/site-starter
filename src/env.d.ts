// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

export type Font = {
  family: string;
  source: string;
  descriptors: Record<string, string>;
};
