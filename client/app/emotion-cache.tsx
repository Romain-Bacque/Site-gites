"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

export function createEmotionCache() {
  return createCache({ key: "css", prepend: true });
}

export default function EmotionCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = React.useState(() => createEmotionCache());

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
