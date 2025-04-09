"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PreviewArticle from "@/components/preview-article";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import ArticleDraftCard from "@/components/article-draft-card";
const ITEMS_PER_PAGE = 5;

export default function DraftArticle() {
  const [articles, setArticles] = useState(null);

  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = currentPage * ITEMS_PER_PAGE - 1;

  useEffect(() => {
    fetchDraftArticles();
  }, [currentPage]);

  const fetchDraftArticles = async () => {
    setLoading(true);
    const { data, error, count } = await supabase
      .from("article")
      .select("*", { count: "exact" })
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error(`Error fetching draft article details: ${error.message}`);
      setLoading(false);
      return;
    } else {
      setArticles(data);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

      setLoading(false);
    }
  };

  const tempLoop = ["1", "2", "3", "4", "5"];

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-28 rounded" />
            <Skeleton className="h-8 w-28 rounded" />
          </div>
          <div className="flex items-center ">
            <Skeleton className="h-8 w-28 rounded" />
          </div>
        </div>
        {tempLoop &&
          tempLoop.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
            >
              {/* Image - spans 2 columns on md+ */}
              <div className="md:col-span-2">
                <Skeleton className="w-full h-40 md:h-48 rounded" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>
          ))}
        <div className="justify-center items-center space-x-4 md:flex hidden">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
        <div className="justify-end items-center space-x-4  md:hidden flex">
          <Skeleton className="h-8 w-12 rounded" />
          <Skeleton className="h-8 w-12 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage href="/draft-view">Draft Articles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Button - View Draft */}
        <Link href="/article-view" passHref>
          <Button variant="outline" className="ml-2 whitespace-nowrap">
            <span className="inline md:hidden">View Articles</span>
            <span className="hidden md:inline">Go to Published Article</span>
          </Button>
        </Link>
      </div>

      <br />

      {articles && articles.length > 0
        ? articles.map((article) => (
            <ArticleDraftCard
              key={article.id}
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
          ))
        : ""}

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
