import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "API Explorer — Visual API Catalog",
    template: "%s | API Explorer",
  },
  description:
    "Discover public APIs through beautiful visual previews. Browse 1,500+ APIs with rendered sample data, not just docs links.",
  keywords: [
    "API",
    "public APIs",
    "API catalog",
    "API directory",
    "REST API",
    "developer tools",
    "API explorer",
  ],
  authors: [{ name: "API Explorer" }],
  openGraph: {
    title: "API Explorer — Visual API Catalog",
    description:
      "Discover public APIs through beautiful visual previews. Browse 1,500+ APIs with rendered sample data.",
    type: "website",
    siteName: "API Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Explorer — Visual API Catalog",
    description:
      "Discover public APIs through beautiful visual previews. Browse 1,500+ APIs with rendered sample data.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "API Explorer",
              description:
                "Visual catalog of 1,500+ public APIs with rendered sample data previews.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
