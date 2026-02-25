"use client";

import { SampleResponse } from "@/components/sample-response";

interface DetailSampleResponseProps {
  sampleResponse: Record<string, unknown>;
}

export function DetailSampleResponse({ sampleResponse }: DetailSampleResponseProps) {
  return <SampleResponse data={sampleResponse} />;
}
