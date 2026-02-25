"use client";

import { PreviewRenderer } from "@/components/previews";
import type { PreviewData } from "@/lib/types";

interface DetailPreviewProps {
  preview: PreviewData;
}

export function DetailPreview({ preview }: DetailPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
      <PreviewRenderer data={preview} compact={false} />
    </div>
  );
}
