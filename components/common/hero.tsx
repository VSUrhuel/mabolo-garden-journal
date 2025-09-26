import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Link from "next/link";

export default function Header() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center  px-4 py-6 w-full">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-50 font-serif">
          Welcome to Mabolo Garden Journal
        </h1>
        <p className="text-xl text-green-600 italic">
          Cultivate Your Green Sanctuary
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-100 leading-relaxed">
          Discover the joy of gardening with our curated tips, seasonal guides,
          and personal journaling tools. Whether you're a budding grower or a
          seasoned green thumb, let’s nurture your garden—one leaf at a time.
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          {/* Primary Button (Dark Mode) */}
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg 
                    hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 
                    transition-all duration-200 shadow-md 
                    dark:shadow-green-900/30"
          >
            <Link href="/journal/editor">Start Journaling</Link>
          </button>

          {/* Secondary Button (Dark Mode) */}
          <button
            className="px-6 py-2 border border-green-600 text-green-600 rounded-lg 
                    hover:bg-green-50 dark:border-green-400 dark:text-green-100 
                    dark:hover:bg-green-900/30 dark:hover:border-green-300 
                    transition-all duration-200 shadow-sm 
                    dark:shadow-green-900/10"
          >
            <Link href="/article-view">Explore Articles</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
