"use client";
import React, { useEffect, useState } from "react";
import ArticleCard from "./article-card";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeaturedArticle from "@/components/feature-article";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

const ITEMS_PER_PAGE = 3;

export default function ArticlePost() {
  const supabase = createClient();
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [regularArticles, setRegularArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    setLoading(true);

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = currentPage * ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from("article")
      .select("*") // head must be false or omitted to get data
      .eq("status", "published")
      .lte("published_date", new Date().toISOString())
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) {
      toast.error(`Error fetching articles: ${error.message}`);
      setLoading(false);
      return;
    } else {
      setFeaturedArticle(data?.[0]);

      setRegularArticles(data?.slice(1)); // already paginated
      setArticles(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    }

    setLoading(false);
    toast.success("Articles fetched successfully!");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {/* Featured Article Skeleton */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <Skeleton className="h-64 md:h-72 w-full rounded-xl shadow-sm" />
          <div className="space-y-2 px-2">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>

        {/* Regular Articles Skeleton */}
        <div className="flex flex-col space-y-4">
          {[1, 2].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full rounded-xl shadow-sm" />
              <div className="space-y-1 px-2">
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sdgParm = ["1", "2", "3", "4", "5", "6", "7"];
  return (
    <div className="space-y-6 w-full mb-6">
      <div className="flex w-full items-center justify-between mb-4 relative">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-50 flex-shrink-0">
          Journals
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-0">
        <div className="col-span-1 md:col-span-2">
          {featuredArticle && (
            <FeaturedArticle
              key={featuredArticle.id}
              article={{
                content: featuredArticle.content,
                title: featuredArticle.title,
                image: featuredArticle.cover_image,
                tags: featuredArticle.tags,
                sdg: featuredArticle.categories,
                date: featuredArticle.published_date,
                json: featuredArticle.json_content,
              }}
            />
          )}
        </div>

        <div className="grid gap-4">
          {regularArticles &&
            regularArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{
                  content: article.content,
                  title: article.title,
                  image: article.cover_image,
                  tags: article.tags,
                  sdg: article.categories,
                  date: article.published_date,
                  json: article.json_content,
                }}
              />
            ))}
        </div>
      </div>
      <Pagination className="hidden md:flex" aria-label="Pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
