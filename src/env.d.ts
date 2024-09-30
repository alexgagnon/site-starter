// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

export type Font = {
  family: string;
  descriptors: Record<string, string>;
  type: string;
  href: string;
};
