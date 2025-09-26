"use client";
import { Skeleton } from "@/components/ui/skeleton";
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
import ArticleEditorForm from "@/app/journal/editor/components/ArticleEditorForm";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ArticleDraftEditor({ params }) {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;
  const supabase = createClient();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (id) {
      fetchArticleDetails(id);
    }
  }, [id]);

  const fetchArticleDetails = async (articleId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .eq("id", articleId)
      .maybeSingle(); // Use .maybeSingle() instead of .single()

    if (error) {
      toast.error(`Error fetching article details: ${error.message}`);
      // Redirect if there's an unexpected error
      router.push("/draft-view");
    } else if (!data) {
      // Handle the case where the article is not found
      toast.error("Draft article not found.");
      router.push("/draft-view");
    } else {
      setFeaturedArticle(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {/* Skeleton Loader */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-1/4 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Render nothing or a message while redirecting
  if (!featuredArticle) {
    return <p>Redirecting...</p>;
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
            <BreadcrumbLink href="/draft-view">Drafts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">
              {featuredArticle.title || "Editing Draft"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <div>
        <ArticleEditorForm article={featuredArticle} />
      </div>
    </div>
  );
}