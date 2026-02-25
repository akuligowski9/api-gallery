export interface CategoryDef {
  name: string;
  emoji: string;
  filterLabel: string;
}

export const CATEGORIES: CategoryDef[] = [
  { name: "Animals", emoji: "🐾", filterLabel: "Animals" },
  { name: "Anime", emoji: "🎌", filterLabel: "Anime" },
  { name: "Anti-Malware", emoji: "🛡️", filterLabel: "Security" },
  { name: "Art & Design", emoji: "🎨", filterLabel: "Art" },
  { name: "Authentication & Authorization", emoji: "🔐", filterLabel: "Auth" },
  { name: "Blockchain", emoji: "⛓️", filterLabel: "Blockchain" },
  { name: "Books", emoji: "📚", filterLabel: "Books" },
  { name: "Business", emoji: "💼", filterLabel: "Business" },
  { name: "Calendar", emoji: "📅", filterLabel: "Calendar" },
  { name: "Cloud Storage & File Sharing", emoji: "☁️", filterLabel: "Cloud" },
  { name: "Continuous Integration", emoji: "🔄", filterLabel: "CI/CD" },
  { name: "Cryptocurrency", emoji: "🪙", filterLabel: "Crypto" },
  { name: "Currency Exchange", emoji: "💱", filterLabel: "Currency" },
  { name: "Data Validation", emoji: "✅", filterLabel: "Validation" },
  { name: "Development", emoji: "💻", filterLabel: "Dev Tools" },
  { name: "Dictionaries", emoji: "📖", filterLabel: "Dictionaries" },
  { name: "Documents & Productivity", emoji: "📄", filterLabel: "Docs" },
  { name: "Email", emoji: "📧", filterLabel: "Email" },
  { name: "Entertainment", emoji: "🎭", filterLabel: "Entertainment" },
  { name: "Environment", emoji: "🌍", filterLabel: "Environment" },
  { name: "Events", emoji: "🎪", filterLabel: "Events" },
  { name: "Finance", emoji: "📈", filterLabel: "Finance" },
  { name: "Food & Drink", emoji: "🍕", filterLabel: "Food" },
  { name: "Games & Comics", emoji: "🎮", filterLabel: "Games" },
  { name: "Geocoding", emoji: "🗺️", filterLabel: "Maps" },
  { name: "Government", emoji: "🏛️", filterLabel: "Government" },
  { name: "Health", emoji: "🏥", filterLabel: "Health" },
  { name: "Jobs", emoji: "💼", filterLabel: "Jobs" },
  { name: "Machine Learning", emoji: "🤖", filterLabel: "AI/ML" },
  { name: "Music", emoji: "🎵", filterLabel: "Music" },
  { name: "News", emoji: "📰", filterLabel: "News" },
  { name: "Open Data", emoji: "📊", filterLabel: "Data" },
  { name: "Open Source Projects", emoji: "🔓", filterLabel: "Open Source" },
  { name: "Patent", emoji: "📜", filterLabel: "Patent" },
  { name: "Personality", emoji: "🧠", filterLabel: "Personality" },
  { name: "Phone", emoji: "📱", filterLabel: "Phone" },
  { name: "Photography", emoji: "📷", filterLabel: "Photography" },
  { name: "Podcasts", emoji: "🎙️", filterLabel: "Podcasts" },
  { name: "Programming", emoji: "⌨️", filterLabel: "Programming" },
  { name: "Science & Math", emoji: "🔬", filterLabel: "Science" },
  { name: "Security", emoji: "🔒", filterLabel: "Security" },
  { name: "Shopping", emoji: "🛒", filterLabel: "Shopping" },
  { name: "Social", emoji: "👥", filterLabel: "Social" },
  { name: "Sports & Fitness", emoji: "⚽", filterLabel: "Sports" },
  { name: "Test Data", emoji: "🧪", filterLabel: "Test Data" },
  { name: "Text Analysis", emoji: "📝", filterLabel: "Text" },
  { name: "Tracking", emoji: "📦", filterLabel: "Tracking" },
  { name: "Transportation", emoji: "🚌", filterLabel: "Transport" },
  { name: "URL Shorteners", emoji: "🔗", filterLabel: "URLs" },
  { name: "Vehicle", emoji: "🚗", filterLabel: "Vehicle" },
  { name: "Video", emoji: "🎬", filterLabel: "Video" },
  { name: "Weather", emoji: "⛅", filterLabel: "Weather" },
];

const emojiMap = new Map(CATEGORIES.map((c) => [c.name, c.emoji]));

export function getCategoryEmoji(category: string): string {
  return emojiMap.get(category) ?? "📦";
}

/** Top-level filter categories shown as chips on the homepage. */
export const FILTER_CATEGORIES = [
  "All",
  "Weather",
  "Maps",
  "Finance",
  "Music",
  "Social",
  "AI/ML",
  "Data",
  "Fun",
  "Dev Tools",
  "Science",
  "Animals",
  "Photography",
  "News",
  "Health",
  "Food",
  "Games",
];

/**
 * Maps a filter chip label to the catalog category names it includes.
 * "All" is handled separately. "Fun" and "Data" group multiple categories.
 */
const filterToCategoriesMap: Record<string, string[]> = {
  Weather: ["Weather"],
  Maps: ["Geocoding"],
  Finance: ["Finance", "Currency Exchange", "Cryptocurrency"],
  Music: ["Music"],
  Social: ["Social"],
  "AI/ML": ["Machine Learning"],
  Data: ["Open Data", "Data Validation"],
  Fun: ["Entertainment", "Games & Comics", "Personality"],
  "Dev Tools": ["Development", "Test Data", "Continuous Integration"],
  Science: ["Science & Math"],
  Animals: ["Animals"],
  Photography: ["Photography"],
  News: ["News"],
  Health: ["Health"],
  Food: ["Food & Drink"],
  Games: ["Games & Comics"],
};

export function getCategoriesForFilter(filter: string): string[] | null {
  if (filter === "All") return null;
  return filterToCategoriesMap[filter] ?? null;
}
