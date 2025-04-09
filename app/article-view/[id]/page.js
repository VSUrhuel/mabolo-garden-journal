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
import PreviewArticle from "@/components/preview-article";

export default function ArticleView({ params }) {
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
      <div className="space-y-4 w-full max-w-4xl mx-aruto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
        <Skeleton className="h-8 w-3/4 rounded" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="h-64 w-full rounded" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        <div className="grid space-y-2">
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="grid space-y-2">
          <Skeleton className="h-4 w-1/2 rounded" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/article-view">Articles</BreadcrumbLink>
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
        <PreviewArticle
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
