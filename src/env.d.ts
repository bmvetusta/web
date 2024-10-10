/// <reference path="../.astro/types.d.ts" />

import type { FeatureFlags } from './pages/.well-known/vercel/flags';

declare namespace App {
  interface Locals {
    flags: FeatureFlags;
  }
}
