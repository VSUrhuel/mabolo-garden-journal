import { useState, useEffect, useRef, useCallback } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";
import { toast } from "sonner";
import { saveDraft, publishArticle } from "../services/articleService";
import { formatDateTimeLocal } from "../utils/helper";
import { get } from "http";
const getArrayFromStorage = (key: string) => {
  const storedValue = getLocalStorageItem(key);
  if (!storedValue) return [];
  try {
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};
export default function useArticleEditor(article: any) {
  // --- STATE INITIALIZATION ---
  // Initialize state from localStorage first, then the article prop, then a default.
  // The function form `useState(() => ...)` ensures localStorage is read only once on mount.
  const [title, setTitle] = useState(article?.title || "");
  const [categories, setCategories] = useState(() => {
    const storedCategories = getLocalStorageItem("article-categories");
    if (storedCategories) {
      // Safely parse the JSON string back into an array
      try {
        return JSON.parse(storedCategories);
      } catch (e) {
        return []; // Return empty array if parsing fails
      }
    }
    return article?.categories || []; // Fallback to prop or empty array
  });
  const [tags, setTags] = useState(
    () => getLocalStorageItem("article-tags") || article?.tags?.join(", ") || ""
  );
  const [author, setAuthor] = useState(
    () =>
      getLocalStorageItem("article-author") || article?.author || "Mabolo Admin"
  );

  const [editorContent, setEditorContent] = useState(article?.content || "");
  const [imageUrl, setImageUrl] = useState(
    () => getLocalStorageItem("article-image") || article?.cover_image || null
  );
  const [previewImage, setPreviewImage] = useState(
    article?.cover_image || null
  );
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Replace 'any' with the actual editor type if available (e.g., Editor from tiptap)
  const editorRef = useRef<any>(null);

  // --- EFFECTS ---
  // Syncs state and localStorage when the article prop changes (e.g., editing a different article)
  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setLocalStorageItem("article-image", article.cover_image || "");
      setPreviewImage(article.cover_image || null);

      // Update state AND localStorage for these fields
      const articleCategories = article.categories || [];
      const articleTags = article.tags?.join(", ") || "";
      const articleAuthor = article.author || "Mabolo Admin";

      setCategories(articleCategories);
      setTags(articleTags);
      setAuthor(articleAuthor);

      setLocalStorageItem(
        "article-categories",
        JSON.stringify(articleCategories)
      );
      setLocalStorageItem("article-tags", articleTags);
      setLocalStorageItem("article-author", articleAuthor);
    }
  }, [article]);

  // Backs up editor content periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current?.isAlive) {
        const content = editorRef.current.getHTML();
        setLocalStorageItem("editor-backup", content);
        setLocalStorageItem("editor-backup-json", editorRef.current.getJSON());
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const getContent = useCallback(() => {
    if (editorRef.current) {
      return {
        html: editorRef.current.getHTML(),
        json: editorRef.current.getJSON(),
      };
    }
    return { html: editorContent, json: null };
  }, [editorContent]);

  // Handlers now update both state and localStorage
  const handleCategoriesChange = useCallback((newCategories: string[]) => {
    setCategories(newCategories);
    setLocalStorageItem("article-categories", JSON.stringify(newCategories));
  }, []);

  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTags(e.target.value);
      setLocalStorageItem("article-tags", e.target.value);
    },
    []
  );

  const handleAuthorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAuthor(e.target.value);
      setLocalStorageItem("article-author", e.target.value);
    },
    []
  );

  const handleSaveDraft = useCallback(async () => {
    const { html, json } = getContent();
    const articleData = {
      id: article?.id, // Include ID if editing an existing article
      title,
      content: html,
      json_content: JSON.stringify(json),
      published_date: "",
      cover_image: getLocalStorageItem("article-image") || "",
      // Read directly from localStorage to get the most up-to-date values
      categories: getArrayFromStorage("article-categories"),
      tags: (getLocalStorageItem("article-tags") || "")
        .split(",")
        .map((t: string) => t.trim()),
      author: getLocalStorageItem("article-author") || "Mabolo Admin",
    };
    await saveDraft(articleData);
    window.location.href = "/journal/draft-view";
  }, [title, imageUrl, article?.id, getContent]);

  const handlePublish = useCallback(async () => {
    const { html, json } = getContent();
    const articleData = {
      id: article?.id, // Include ID if editing an existing article
      title,
      content: html,
      published_date: formatDateTimeLocal(new Date().toISOString()),
      json_content: JSON.stringify(json),
      cover_image: getLocalStorageItem("article-image") || "",
      // Read directly from localStorage
      categories: getArrayFromStorage("article-categories"),
      tags: (getLocalStorageItem("article-tags") || "")
        .split(",")
        .map((t: string) => t.trim()),
      author: getLocalStorageItem("article-author") || "Mabolo Admin",
    };
    await publishArticle(articleData);
    history.back();
  }, [title, imageUrl, article?.id, getContent]);

  // Other handlers...
  const handleContentChange = (content: any) => setEditorContent(content);
  const handlePreview = () => {
    const content =
      editorRef.current?.getHTML() ||
      article?.content ||
      getLocalStorageItem("editor-backup");

    if (!content) {
      toast.error("Please write something before previewing.");
      return;
    }

    setEditorContent(content);
  };

  const handleChangeCoverImage = (url: string) => {
    setImageUrl(url);
    setPreviewImage(url);
    setLocalStorageItem("article-image", url);
  };

  return {
    title,
    setTitle,
    categories,
    setCategories,
    tags,
    setTags,
    author,
    setAuthor,
    editorContent,
    setEditorContent,
    imageUrl,
    setImageUrl,
    previewImage,
    setPreviewImage,
    isEditorReady,
    setIsEditorReady,
    uploading,
    setUploading,
    editorRef,
    handleContentChange,
    handlePreview,
    getContent,
    handleSaveDraft,
    handlePublish,
    // Return the new handlers so your UI components can use them
    handleCategoriesChange,
    handleTagsChange,
    handleAuthorChange,
    handleChangeCoverImage,
  };
}