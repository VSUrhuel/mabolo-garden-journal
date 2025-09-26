import React, { useState } from "react";
import Image from "next/image";
export default function PreviewArticle({
  title,
  publishDate,
  sdgParm,
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
  function formatArticleContent(content, jsonContent) {
    // 1. Add <br /> between <img> and <p> tags
    let processedContent = content.replace(
      /<\/(p|img)>\s*(<p|img)/g,
      "</$1><br />$2"
    );

    // 2. Add styling for images (e.g., border-radius and consistent width)
    processedContent = processedContent.replace(/<img([^>]+)>/g, (match) => {
      // If an image doesn't already have styles, add the border-radius
      return match.replace(
        /<img([^>]+)>/,
        '<img$1 style="border-radius: 8px; max-width: 100%; height: auto;" />'
      );
    });

    // 3. Justify the text for article content (using CSS for better control)
    processedContent = `<div style="text-align: justify;">${processedContent}</div>`;

    return processedContent;
  }

  const processedContent = formatArticleContent(content, jsonContent);

  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="text-gray-500 md:flex grid space-y-0 space-x-0 md:space-x-4 py-2 my-4 text-sm mt-2  px-2 rounded-lg border  ">
        <div className="flex items-center ">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="dark:text-100">Written by: </span>
          <span className="sm:ml-2 text-gray-700 dark:text-gray-100 font-semibold">
            {" "}
            Mabolo Admin
          </span>
        </div>
        <div className="flex items-center mr-0 ml-0 space-x-2 md:space-y-0 ">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="mr-0 ml-0 md:mr-2 dark:text-100 ">Published:</span>
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

      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      <br />
      <div className=" border-t border-gray-200 pt-2">
        {/* Categories Section */}
        <h3 className="text-sm mt-2 font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
          Sustainable Development Goals
        </h3>
        <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
          This article aligns with the following SDGs:
        </p>

        <div className="flex flex-wrap gap-4">
          {sdgParm &&
            sdgParm.map((sdg) => {
              const sdgNumber = sdg.trim();

              return (
                <div
                  key={sdg}
                  className="group relative w-16 flex flex-col items-center"
                >
                  <div className="mt-2 w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={`/sdg-icon-dark/E Inverted Icons_WEB-${sdgNumber}.png`}
                      alt={`SDG ${sdgNumber}`}
                      width={54}
                      height={64}
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <span className="text-xs dark:text-gray-400 text-gray-600 mt-2 text-center font-medium">
                    SDG {sdgNumber}
                  </span>
                </div>
              );
            })}
        </div>
        <br />
        {/* Tags Section */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold dark:text-gray-400 uppercase tracking-wider mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags &&
              tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 dark:bg-blue-100 dark:text-black hover:bg-blue-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
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
