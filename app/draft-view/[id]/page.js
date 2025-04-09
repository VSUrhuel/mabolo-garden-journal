"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ArticleWriter from "@/components/article-writer";

export default function ArticleDraftEditor({ params }) {
  const [featuredArticle, setFeaturedArticle] = useState(null);

  const { id } = use(params); // Unwrap the params
  const [articleId, setArticleId] = useState("");
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setArticleId(id);
    fetchArticleDetails(id);
  }, [id]);

  const fetchArticleDetails = async (id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error(`Error fetching article details: ${error.message}`);
    } else {
      setFeaturedArticle(data);

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {/* Top row with buttons */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-1/4 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column (2/3 width) */}
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-18 md:h-24 w-full rounded-xl shadow-sm" />
            <Skeleton className="h-64 md:h-72 w-full rounded-xl shadow-sm" />

            {/* Editor area */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>

          {/* Right column (1/3 width) with three specific cards */}
          <div className="space-y-4">
            {/* Categories & Tags Card */}
            <div className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-5 w-1/3 rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-5 w-1/4 rounded" />
              <Skeleton className="h-8 w-full rounded" />
            </div>

            {/* Featured Image Card */}
            <div className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-5 w-2/5 rounded" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded" />
            </div>

            {/* Publishing Card */}
            <div className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-5 w-2/5 rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/draft-view">Draft Articles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage
              href={`/article-view/${articleId}`}
              className="truncate text-ellipsis overflow-hidden"
            >
              {featuredArticle.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <div>
        <ArticleWriter
          id={featuredArticle.id}
          title={featuredArticle.title}
          publishDate={featuredArticle.published_date}
          sdgParm={featuredArticle.categories}
          tags={featuredArticle.tags.join(", ")}
          content={featuredArticle.content}
          jsonContent={featuredArticle.json_content}
          imageUrl={featuredArticle.cover_image}
        />
      </div>
    </div>
  );
}
