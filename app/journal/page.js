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
    <div className="grid grid-cols-3 gap-4 w-full h-full">
      <ArticleWriter />
    </div>
  );
}
