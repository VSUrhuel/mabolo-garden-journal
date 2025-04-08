import React, { useState } from "react";
import Image from "next/image";
export default function PreviewArticle({
  title,
  publishDate,
  sdgs,
  tags,
  content,
  jsonContent,
  imageUrl,
}) {
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      setDarkMode(e.matches);
    });

  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="text-gray-500 flex space-x-4 py-2 my-4 text-sm mt-2 bg-red-500/10 px-2 rounded-lg border ">
        <div className="flex items-center space-x-3">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clip-rule="evenodd"
            />
          </svg>

          <span className="mr-2 dark:text-100">Written by: </span>
          <span className="ml-2 text-gray-700 dark:text-gray-100 font-semibold">
            {" "}
            Mabolo Admin
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
              clip-rule="evenodd"
            />
          </svg>

          <span className="mr-2 dark:text-100">Published:</span>
          <span className="text-gray-700 dark:text-gray-100 font-semibold">
            {new Date(publishDate).toLocaleDateString("en-US")}
          </span>
        </div>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Featured"
          className="mt-4 w-full rounded-lg my-4"
        />
      )}

      <br />

      <div dangerouslySetInnerHTML={{ __html: content }} />
      <br />
      <div className="mt-12 border-t border-gray-200 pt-8">
        {/* Categories Section */}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Sustainable Development Goals
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          This article aligns with the following SDGs:
        </p>

        <div className="flex flex-wrap gap-4">
          {sdgs &&
            sdgs.split(",").map((sdg) => {
              const sdgNumber = sdg.trim().replace("SDG", "").trim();

              return (
                <div
                  key={sdg}
                  className="group relative w-16 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={`/sdg-icon-dark/E Inverted Icons_WEB-${sdgNumber}.png`}
                      alt={`SDG ${sdgNumber}`}
                      width={54}
                      height={64}
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center font-medium">
                    SDG {sdgNumber}
                  </span>
                </div>
              );
            })}
        </div>
        <br />
        {/* Tags Section */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags &&
              tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-full text-sm font-medium text-blue-700 transition-colors duration-200"
                >
                  #{tag.trim()}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
