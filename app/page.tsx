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
    </div>
  );
}
