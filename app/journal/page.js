import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ArticleWriter from "@/components/article-writer.js";

export default function Journal() {
  return (
    <div className="grid gap-4 md:w-full md:max-w-6xl mx-auto h-full sm:max-w-2xl">
      <ArticleWriter />
    </div>
  );
}
