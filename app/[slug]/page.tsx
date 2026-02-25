import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Shield, Globe, CheckCircle } from "lucide-react";
import { getAllSlugs, getApiBySlug, getSimilarApis } from "@/lib/api-data";
import { getCategoryEmoji } from "@/lib/categories";
import { AuthBadge } from "@/components/auth-badge";
import { SimilarApis } from "@/components/similar-apis";
import { PreviewRenderer } from "@/components/previews";
import { SampleResponse } from "@/components/sample-response";
import { CodeSnippets } from "@/components/code-snippets";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const api = getApiBySlug(slug);
  if (!api) return {};

  return {
    title: `${api.API} — API Explorer`,
    description: `${api.Description}. Explore the ${api.API} with visual previews, sample data, and documentation.`,
    openGraph: {
      title: `${api.API} — API Explorer`,
      description: api.Description,
    },
  };
}

export default async function ApiDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const api = getApiBySlug(slug);

  if (!api) {
    notFound();
  }

  const similarApis = getSimilarApis(api, 6);
  const emoji = getCategoryEmoji(api.Category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-2xl">
            {emoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {api.API}
              </h1>
              <AuthBadge auth={api.Auth} />
            </div>
            <p className="mt-1.5 text-base text-muted-foreground">
              {api.Description}
            </p>

            {/* Meta badges */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base">{emoji}</span>
                {api.Category}
              </span>
              {api.HTTPS && (
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  HTTPS
                </span>
              )}
              {api.Cors === "yes" && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-blue-500" />
                  CORS enabled
                </span>
              )}
              {!api.Auth && (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  No API key required
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Full-size preview */}
      {api.preview && (
        <section className="mb-10">
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
            <PreviewRenderer data={api.preview} compact={false} />
          </div>
        </section>
      )}

      {/* Sample response */}
      {api.preview && (
        <div className="mb-10">
          <SampleResponse data={api.preview.sampleResponse} />
        </div>
      )}

      {/* Code snippets */}
      <div className="mb-10">
        <CodeSnippets api={api} />
      </div>

      {/* Links */}
      <section className="mb-10 flex flex-wrap gap-3">
        <a
          href={api.Link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" />
          View Documentation
        </a>
      </section>

      {/* Divider */}
      <div className="mb-10 border-t border-border" />

      {/* Similar APIs */}
      <SimilarApis apis={similarApis} />
    </div>
  );
}
