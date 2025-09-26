import { useState, useEffect, useRef } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";
import { toast } from "sonner";
import {
  saveDraft,
  publishArticle,
} from "../services/articleService";
import { formatDateTimeLocal } from "../utils/helper";

export default function useArticleEditor(article : any) {
  const [title, setTitle] = useState(article?.title || "");
  const [publishDate, setPublishDate] = useState( ""
  );
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
    const backup = getLocalStorageItem("editor-backup");
    if (backup) {
      setEditorContent(backup);
    }
  }, []);

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

  const handleContentChange = (content: any) => {
    setEditorContent(content);
  };

  const handlePreview = () => {
    const content = editorRef.current?.getHTML();
    if (!content) {
      toast.error("Please write something before previewing.");
      return;
    }
    setEditorContent(content);
  };

  const getContent = () => {
    if (editorRef.current) {
      return {
        html: editorRef.current.getHTML(),
        json: editorRef.current.getJSON(),
      };
    }
    return { html: editorContent, json: null };
  };

  const handleSaveDraft = async () => {
    const { html, json } = getContent();
    const articleData = {
      title,
      content: html,
      json_content: JSON.stringify(json),
      published_date: "",
      categories,
      tags: tags.split(",").map((t: string) => t.trim()),
      cover_image: imageUrl,
    };
    await saveDraft(articleData, article?.id);
    history.back();
  };

  const handlePublish = async () => {
    const { html, json } = getContent();
    const articleData = {
      title,
      content: html,
      published_date: formatDateTimeLocal(new Date().toISOString()),
      json_content: JSON.stringify(json),
      categories,
      tags: tags.split(",").map((t: string) => t.trim()),
      cover_image: imageUrl,
    };
    setPublishDate(formatDateTimeLocal(new Date().toISOString()));
    await publishArticle(articleData, article?.id);
    history.back();
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
