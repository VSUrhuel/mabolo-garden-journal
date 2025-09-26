import { useState, useEffect, useRef, useCallback } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";
import { toast } from "sonner";
import { saveDraft, publishArticle } from "../services/articleService";
import { formatDateTimeLocal } from "../utils/helper";

export default function useArticleEditor(article: any) {
  const [title, setTitle] = useState(article?.title || "");
  const [publishDate, setPublishDate] = useState("");
  const [categories, setCategories] = useState(article?.categories || []);
  const [tags, setTags] = useState(article?.tags?.join(", ") || "");
  const [editorContent, setEditorContent] = useState(article?.content || "");
  const [imageUrl, setImageUrl] = useState(article?.cover_image || null);
  const [previewImage, setPreviewImage] = useState(
    article?.cover_image || null
  );
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [author, setAuthor] = useState(article?.author || "Mabolo Admin");

  type EditorRefType = {
    getHTML: () => string;
    getJSON: () => unknown;
    isAlive?: boolean;
  };

  const editorRef = useRef<EditorRefType | null>(null);

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setCategories(article.categories || []);
      setTags(article.tags?.join(", ") || "");
      setImageUrl(article.cover_image || null);
      setPreviewImage(article.cover_image || null);
      setAuthor(article.author || "Mabolo Admin");
      setLocalStorageItem("article-author", article.author || "Mabolo Admin");
    }
  }, [article]);

  // Backup content to local storage periodically
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

  const getContent = useCallback(() => {
    if (editorRef.current) {
      return {
        html: editorRef.current.getHTML(),
        json: editorRef.current.getJSON(),
      };
    }
    return { html: editorContent, json: null };
  }, [editorContent]);

  const handleSaveDraft = useCallback(async () => {
    const { html, json } = getContent();
    const articleData = {
      title,
      content: html,
      json_content: JSON.stringify(json),
      published_date: "",
      categories,
      tags: tags.split(",").map((t: string) => t.trim()),
      cover_image: imageUrl,
      author: getLocalStorageItem("article-author"), // This now correctly uses the latest author state
    };
    await saveDraft(articleData, article?.id);
    window.location.href = "/draft-view";
  }, [author, title, categories, tags, imageUrl, article?.id, getContent]);

  const handlePublish = useCallback(async () => {
    const { html, json } = getContent();
    const articleData = {
      title,
      content: html,
      published_date: formatDateTimeLocal(new Date().toISOString()),
      json_content: JSON.stringify(json),
      categories,
      tags: tags.split(",").map((t: string) => t.trim()),
      cover_image: imageUrl,
      author: getLocalStorageItem("article-author"), // This also uses the latest author state
    };
    await publishArticle(articleData, article?.id);
    history.back();
  }, [author, title, categories, tags, imageUrl, article?.id, getContent]);

  const handleAuthorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAuthor(e.target.value);
      setLocalStorageItem("article-author", e.target.value);
    },
    [] // setAuthor is stable and doesn't need to be in dependencies
  );

  const handleContentChange = (content: any) => {
    setEditorContent(content);
  };
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

  return {
    title,
    setTitle,
    publishDate,
    categories,
    setCategories,
    tags,
    setTags,
    editorContent,
    setEditorContent,
    imageUrl,
    setImageUrl,
    author,
    setAuthor,
    handleAuthorChange,
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
  };
}
