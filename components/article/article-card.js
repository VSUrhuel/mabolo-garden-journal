import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const ArticleCard = ({ article }) => {
  const { articleId, content, title, image, tags, sdg, date, json } = article;

  const convertDateToFormat = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const formattedDate = convertDateToFormat(date);

  const convertHtmlToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const textContent = convertHtmlToText(content);

  return (
    <div>
      <Card className="w-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden group">
        <div className="overflow-hidden rounded-t-lg group">
          <img
            src={
              image ?? "https://via.placeholder.com/400x200.png?text=No+Image"
            }
            alt="Featured Content"
            className="w-full h-40 rounded-t-md md:h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(event) => {
              event.target.onerror = null;
              event.target.src =
                "https://via.placeholder.com/400x200.png?text=Image+Not+Found";
            }}
          />
        </div>
        <CardHeader className="px-3 pt-3 pb-1 space-y-1 md:px-4 md:pt-4 md:pb-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
            <span>{article.author ?? "Mabolo Admin"}</span>
            <span>•</span>
            <time>{formattedDate}</time>
          </div>
          <CardTitle className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-2 md:text-lg">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-3 pb-3 md:px-4 md:pb-4">
          <p className="text-gray-600 text-xs dark:text-gray-100 line-clamp-2 md:text-sm">
            {textContent}
          </p>
        </CardContent>

        <CardFooter className="px-3 pb-3 flex justify-between items-end md:px-4 md:pb-4">
          <div></div>
          <Link
            href={`/article-view/${articleId}`}
            className="text-blue-600 dark:text-green-400 hover:text-blue-800 dark:hover:text-green-300 font-medium transition-colors flex items-center gap-1 text-xs md:text-sm"
          >
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
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
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArticleCard;
