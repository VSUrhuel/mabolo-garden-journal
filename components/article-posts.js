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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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
      .select("*", { count: "exact" })
      .eq("status", "published")
      .lte("published_date", new Date().toISOString())
      .order("published_date", { ascending: false })
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
                articleId: featuredArticle.id,
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
                article={{
                  articleId: article.id,
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
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page ? "bg-green-500 text-white" : ""
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination
        className="md:hidden flex justify-end w-full"
        aria-label="Pagination"
      >
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
          </PaginationItem>

          <PaginationItem>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
