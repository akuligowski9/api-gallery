import { getAllApis } from "@/lib/api-data";
import { Header } from "@/components/header";
import { ApiGrid } from "@/components/api-grid";

export default function Home() {
  const apis = getAllApis();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Header />

      <main className="mt-10 space-y-2">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore public APIs
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse {apis.length.toLocaleString()} APIs with visual previews,
            sample data, and instant docs.
          </p>
        </div>

        <ApiGrid apis={apis} />
      </main>

      <footer className="mt-20 border-t border-border pb-8 pt-6 text-center text-sm text-muted-foreground">
        <p>
          API catalog data from{" "}
          <a
            href="https://github.com/marcelscruz/public-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            marcelscruz/public-apis
          </a>{" "}
          (MIT). Built with Next.js + Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
