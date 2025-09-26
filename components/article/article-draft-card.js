import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

const ArticleDraftCard = ({ article }) => {
  const { articleId, content, title, image, tags, sdg, date, json, author } =
    article;
  const convertDateToFormat = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }); // 'Mar'
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const formattedDate = convertDateToFormat(date);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this draft?")) {
      const supabase = createClient();
      const { error } = await supabase
        .from("article")
        .delete()
        .eq("id", articleId);
      if (error) {
        toast.error("Error deleting draft: " + error.message);
      } else {
        toast.success("Draft deleted successfully");
        window.location.reload();
      }
    }
  };

  const convertHtmlToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const textContent = convertHtmlToText(content);
  return (
    <Card className="grid md:grid-cols-3 grid-cols-1 space-x-2 gap-2 mb-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden group">
      <div className="col-span-1 md:col-span-2 overflow-hidden rounded-l-lg group">
        <img
          src={image ?? "/profile.jpg"}
          className="w-full md:h-60 object-cover rounded-t-md transition-transform duration-500 ease-in-out group-hover:scale-110"
        ></img>
      </div>
      <div>
        <CardHeader className="px-4 pt-4 pb-2 space-y-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm md:text-md text-gray-500 dark:text-gray-400">
            <span>{author ?? "Mabolo Admin"}</span>
            <span>•</span>
            <time>{formattedDate}</time>
          </div>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-green-100 line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-100 md:line-clamp-3 line-clamp-2 ">
            {textContent}
          </p>
        </CardContent>
        <CardFooter className="px-3 pb-3 flex justify-between md:gap-1 items-center  md:pb-4">
          <div className="flex flex-wrap gap-2 md:gap-2">
            {tags &&
              tags.map((tag) => (
                <span className="px-2 py-1 text-[10px] xs:text-xs bg-blue-100 dark:bg-green-900 text-blue-800 dark:text-green-200 rounded-full">
                  {tag.trim()}
                </span>
              ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/journal/editor/${articleId}`} // Corrected the link to a more likely editor path
              className="text-blue-600 dark:text-green-400 hover:text-blue-800 dark:hover:text-green-300 font-medium transition-colors flex items-center gap-1 text-xs md:text-sm"
            >
              Edit
            </Link>

            {/* 5. Add the Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
              aria-label="Delete draft"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ArticleDraftCard;
