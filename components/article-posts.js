import React from "react";
import ArticleCard from "./article-card";
import Image from "next/image";

export default function ArticlePost() {
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold text-green-800 dark:text-green-50">
        Journals
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-0">
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </div>
    </div>
  );
}
