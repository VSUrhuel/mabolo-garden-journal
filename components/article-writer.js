"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ArticleEditor from "@/components/article-editor.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PreviewArticle from "@/components/preview-article.js";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";
import { toast } from "sonner";
import { get } from "http";

export default function ArticleWriter() {
  const [title, setTitle] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);

  const editorRef = useRef({
    editorInstance: null,
    getHTML: () => "",
    getJSON: () => null,
    isAlive: false,
    isDestroyed: false,
    restore: () => {},
    getEditor: () => null, // Added missing method
  });

  // Fixed useEffect for auto-saving
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current?.isAlive) {
        const content = editorRef.current.getHTML(); // Added parentheses to call the function
        setLocalStorageItem("editor-backup", content);
        setLocalStorageItem("editor-backup-json", editorRef.current.getJSON());
        setEditorContent(content);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handlePreview = () => {
    console.log("Preview clicked");
    const content = getLocalStorageItem("editor-backup");
    console.log("Content:", content);
    if (!content) {
      console.log("please writging frite");
      toast.error("Please write something before previewing.");
      return;
    }
    setEditorContent(content);
    setLocalStorageItem("editor-backup", content);
  };

  const supabase = createClientComponentClient({
    supabaseUrl: "https://gskbnsykaraahykxftrb.supabase.co",
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdza2Juc3lrYXJhYWh5a3hmdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MjczNzgsImV4cCI6MjA1NzIwMzM3OH0.tti14AbGrMF22KXIgUesjRB_9Bz1uNnBCeTuavPx5oc",
  });
  const handleContentChange = (content) => {
    setEditorContent(content);
  };

  // Fixed getContent function
  const getContent = () => {
    try {
      const backupContent = getLocalStorageItem("editor-backup");
      if (backupContent && typeof editorRef.current.restore === "function") {
        editorRef.current.restore(backupContent);
      }

      if (
        editorRef.current &&
        typeof editorRef.current.getHTML === "function"
      ) {
        return {
          html: editorRef.current.getHTML(),
          json: editorRef.current.getJSON(),
        };
      }
      return {
        html: editorContent,
        json: null,
      };
    } catch (error) {
      console.error("Error getting editor content:", error);
      return {
        html: editorContent,
        json: null,
      };
    }
  };

  const handleSaveDraft = async () => {
    const editor = editorRef.current?.getEditor();
    const content = editor?.getHTML() || getLocalStorageItem("editor-backup");
    const jsonContent =
      editor?.getJSON() || getLocalStorageItem("editor-backup-json");

    function generateInt8Id() {
      // Create a 63-bit ID (safe for Postgres int8)
      const timestamp = Date.now(); // 13 digits
      const random = Math.floor(Math.random() * 10000); // 4 digits
      return BigInt(`${timestamp}${random}`); // Combine to 17 digits
    }

    await supabase.from("article").insert([
      {
        id: Number(generateInt8Id()),
        title: title,
        content: content,
        json_content: JSON.stringify(jsonContent),
        created_at: new Date(),
        modified_at: new Date(),
        status: "draft",
        published_date: publishDate || null,
        categories: categories.split(",").map((cat) => cat.trim()),
        tags: tags.split(",").map((tag) => tag.trim()),
        cover_image: imageUrl || null,
      },
    ]);
  };

  const handleFileChange = async (e) => {
    const file = selectedImage || e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setSelectedImage(file);
    uploadImage(file);
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChangeImage = () => {
    setPreviewImage(null);
    setSelectedImage(null);
    setFileInputKey((prev) => prev + 1); // Reset the file input
    handleFileChange;
  };

  const uploadImage = async (img) => {
    if (!img) {
      toast.error("Please select an image to upload");
      return;
    }
    const file = img;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage
        .from("journal-cover")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
        errorUpload,
      } = supabase.storage.from("journal-cover").getPublicUrl(filePath);
      console.log("Error upload", errorUpload);
      setImageUrl(publicUrl);
      console.log("Image URL:", publicUrl);
      toast.success("Image uploaded successfully");
      // Reset the file input and preview
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      console.log("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        {/* Header */}
        <header className="bg-white dark:bg-[#0a0a0a] shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">ArticleForge</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button>Publish</Button>
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#0a0a0a]"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article Editor (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <Card>
              <CardContent className="pt-6">
                <Input
                  placeholder="Article Title"
                  className="text-3xl font-bold border-none focus-visible:ring-0"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Editor Tabs */}
            <Tabs defaultValue="write">
              <TabsList className="grid grid-cols-2 w-[200px]">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview" onClick={handlePreview}>
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <ArticleEditor
                      ref={editorRef}
                      initialContent={editorContent}
                      onContentChange={handleContentChange}
                      onReady={() => setIsEditorReady(true)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <Card>
                  <CardContent className="pt-6 prose max-w-none">
                    {(() => {
                      // Get content safely once to avoid multiple calls
                      const { html, json } = getContent();

                      if (html) {
                        return (
                          <PreviewArticle
                            title={title}
                            publishDate={publishDate}
                            sdgs={categories}
                            tags={tags}
                            content={html}
                            jsonContent={json}
                            imageUrl={imageUrl}
                          />
                        );
                      } else if (getLocalStorageItem("editor-backup")) {
                        return (
                          <PreviewArticle
                            title={title}
                            publishDate={publishDate}
                            sdgs={categories}
                            tags={tags}
                            content={getLocalStorageItem("editor-backup")}
                            jsonContent={json}
                            imageUrl={imageUrl}
                          />
                        );
                      }

                      return (
                        <div className="text-gray-500 italic">
                          {editorRef.current?.getEditor
                            ? "Start writing to see preview"
                            : "Editor is loading... Please wait"}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>
                  Manage your article visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      Draft
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Published
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories & Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Add categories and tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <Input
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="Add categories..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add tags..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      {previewImage ? (
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="max-h-48 max-w-full rounded-md"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={handleChangeImage}
                              disabled={uploading}
                            >
                              Change Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-500 mb-4">
                            Upload an image to add as a cover image
                          </div>
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center justify-center px-4 py-2 my-16 border-2 border-dashed border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 cursor-pointer 
            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
                          >
                            <svg
                              className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Select Image</span>
                          </label>
                          <input
                            key={fileInputKey}
                            id="image-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="sr-only"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <div className="fixed bottom-8 left-1/2  bg-white shadow-lg rounded-full px-4 py-2 flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="font-bold">B</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="italic">I</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="material-icons">format_list_bulleted</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="material-icons">format_list_numbered</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="material-icons">insert_link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Link</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
