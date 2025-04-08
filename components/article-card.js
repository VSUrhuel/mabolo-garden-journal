import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function ArticleCard() {
  return (
    <div>
      <Card className="w-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden group">
        <div className="overflow-hidden rounded-t-lg group">
          <img
            src="/images/image_1.jpg"
            alt="Featured Content"
            className="w-full h-48 rounded-t-md sm:h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
        <CardHeader className="px-4 pt-4 pb-2 space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>John Doe</span>
            <span>•</span>
            <time>10 Mar 2025</time>
          </div>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
            Engaging Article Title That Grabs Attention
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <p className="text-gray-600 dark:text-gray-100 line-clamp-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam...
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 flex justify-between items-center">
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Technology
            </span>
            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Trending
            </span>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1">
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
