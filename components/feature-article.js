import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FeaturedArticle = ({ key, article }) => {
  const articleId = article.id;
  const { content, title, image, tags, sdg, date, json } = article;
  console.log(article);
  const convertDateToFormat = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }); // 'Mar'
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const formattedDate = convertDateToFormat(date);

  const convertHtmlToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const textContent = convertHtmlToText(content);

  const sdgParm = sdg;
  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden group">
      {/* Image with responsive height */}
      <div className="overflow-hidden rounded-t-lg group">
        <img
          src={image}
          alt="Featured Content"
          className="w-full h-48 md:h-64 lg:h-80 rounded-t-md object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* Card Header */}
      <CardHeader className="px-4 pt-4 pb-2 space-y-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm md:text-md text-gray-500 dark:text-gray-400">
          <span>Mabolo Admin</span>
          <span>•</span>
          <time>{formattedDate}</time>
        </div>
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-green-100 line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="px-4 pb-4">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-100 line-clamp-3 sm:line-clamp-4 md:line-clamp-5">
          {textContent}
        </p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="px-4 pb-4 grid gap-4">
        <div className="grid gap-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-green-400 uppercase tracking-wider">
            Sustainable Development Goals
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-green-300">
            This article aligns with the following SDGs:
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-2">
            {sdgParm.map((sdg) => {
              const sdgNumber = sdg.trim();
              return (
                <div
                  key={sdg}
                  className="group relative w-12 sm:w-14 md:w-16 flex flex-col items-center"
                >
                  <div className="mt-1 sm:mt-2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white border-2 border-gray-200 dark:border-green-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={`/sdg-icon-dark/E Inverted Icons_WEB-${sdgNumber}.png`}
                      alt={`SDG ${sdgNumber}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover"
                    />
                  </div>
                  <span className="text-[10px] xs:text-xs dark:text-green-300 text-gray-600 mt-1 sm:mt-2 text-center font-medium">
                    SDG {sdgNumber}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags and Read More */}
        <div className="flex flex-col justify-between md:gap-2 gap-4">
          <div className="flex justify-between gap-1 sm:gap-2">
            <div className="flex flex-wrap gap-2 md:gap-4">
              {tags &&
                tags.map((tag) => (
                  <span className="px-2 py-1 text-[10px] xs:text-xs bg-blue-100 dark:bg-green-900 text-blue-800 dark:text-green-200 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
            </div>

            <button className="text-sm sm:text-base text-blue-600 dark:text-green-400 hover:text-blue-800 dark:hover:text-green-300 font-medium transition-colors flex items-center gap-1">
              Read More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4"
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
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeaturedArticle;
