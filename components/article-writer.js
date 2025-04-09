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
import { get } from "http";
import { Check, ChevronsUpDown, Save, Upload, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function ArticleWriter({
  id: articleId = "",
  title: initialTitle = "",
  publishDate: initialPublishDate = "",
  sdgParm: initialSdgParm = "",
  tags: initialTags = "",
  content: initialContent = "",
  jsonContent: initialJsonContent = "",
  imageUrl: initialImageUrl = null,
}) {
  const [id, setId] = useState(articleId);
  const [title, setTitle] = useState(initialTitle);
  const [publishDate, setPublishDate] = useState(initialPublishDate);
  const [categories, setCategories] = useState(initialSdgParm);
  const [tags, setTags] = useState(initialTags);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialImageUrl);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [editorContent, setEditorContent] = useState(initialContent);
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

  useEffect(() => {
    if (initialContent) {
      setLocalStorageItem("editor-backup", initialContent);
      setLocalStorageItem("editor-backup-json", initialJsonContent);
    }
  }, [initialContent, initialJsonContent]);

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

  const supabase = createClient();
  const handleContentChange = (content) => {
    setEditorContent(content);
  };
  const SDGS = {
    1: {
      title: "No Poverty",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-1.png",
    },
    2: {
      title: "Zero Hunger",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-2.png",
    },
    3: {
      title: "Good Health and Well-being",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-3.png",
    },
    4: {
      title: "Quality Education",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-4.png",
    },
    5: {
      title: "Gender Equality",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-5.png",
    },
    6: {
      title: "Clean Water and Sanitation",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-6.png",
    },
    7: {
      title: "Affordable and Clean Energy",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-7.png",
    },
    8: {
      title: "Decent Work and Economic Growth",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-8.png",
    },
    9: {
      title: "Industry, Innovation and Infrastructure",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-9.png",
    },
    10: {
      title: "Reduced Inequalities",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-10.png",
    },
    11: {
      title: "Sustainable Cities and Communities",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-11.png",
    },
    12: {
      title: "Responsible Consumption and Production",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-12.png",
    },
    13: {
      title: "Climate Action",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-13.png",
    },
    14: {
      title: "Life Below Water",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-14.png",
    },
    15: {
      title: "Life on Land",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-15.png",
    },
    16: {
      title: "Peace, Justice and Strong Institutions",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-16.png",
    },
    17: {
      title: "Partnerships for the Goals",
      icon: "/sdg-icon-dark/E Inverted Icons_WEB-17.png",
    },
  };

  // Fixed getContent function
  const getContent = () => {
    try {
      const backupContent = getLocalStorageItem("editor-backup");
      if (backupContent && typeof editorRef.current?.restore === "function") {
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
      toast.error("Error getting editor content:", error);
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
    const isEditingExisting = initialTitle || initialContent || initialImageUrl;

    if (isEditingExisting) {
      const { data, error } = await supabase
        .from("article")
        .update({
          id: Number(articleId),
          title: title,
          content: content,
          json_content: JSON.stringify(jsonContent),
          modified_at: new Date(),
          status: "draft",
          published_date: publishDate || null,
          categories: categories,
          tags: tags.split(",").map((tag) => tag.trim()),
          cover_image: imageUrl || null,
        })
        .eq("id", articleId)
        .select();

      if (error) {
        toast.error(`Failed to update draft:  ${error.message}`);
        return;
      } else {
        toast.success("Draft updated successfully!");
      }
    } else {
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
          categories: categories,
          tags: tags.split(",").map((tag) => tag.trim()),
          cover_image: imageUrl || null,
        },
      ]);
      toast.success("Draft saved successfully!");
    }
  };

  const handleFuturePublish = async () => {
    const editor = editorRef.current?.getEditor();
    const content = editor?.getHTML() || getLocalStorageItem("editor-backup");
    const jsonContent =
      editor?.getJSON() || getLocalStorageItem("editor-backup-json");
    if (!content) {
      toast.error("Please write something before publishing.");
      return;
    }

    if (!title) {
      toast.error("Please add a title before publishing.");
      return;
    }

    if (!categories) {
      toast.error("Please select at least one SDG category before publishing.");
      return;
    }

    if (!tags) {
      toast.error("Please add at least one tag before publishing.");
      return;
    }

    if (!publishDate) {
      toast.error("Please select a publish date before publishing.");
      return;
    }

    if (publishDate < new Date().toISOString()) {
      toast.error("Publish date cannot be in the past.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a cover image before publishing.");
      return;
    }

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
        status: "published",
        published_date: publishDate || null,
        categories: categories,
        tags: tags.split(",").map((tag) => tag.trim()),
        cover_image: imageUrl || null,
      },
    ]);

    toast.success(
      `Article will be published on ${new Date(publishDate).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`
    );

    setTitle("");
    setEditorContent("");
    setCategories("");
    setTags("");
    setPublishDate("");
    setImageUrl(null);
    setPreviewImage(null);
    setSelectedImage(null);
    setLocalStorageItem("editor-backup", "");
    setLocalStorageItem("editor-backup-json", "");
  };

  const handlePublish = async () => {
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

    if (!content) {
      toast.error("Please write something before publishing.");
      return;
    }

    if (!title) {
      toast.error("Please add a title before publishing.");
      return;
    }

    if (!categories) {
      toast.error("Please select at least one SDG category before publishing.");
      return;
    }

    if (!tags) {
      toast.error("Please add at least one tag before publishing.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a cover image before publishing.");
      return;
    }

    await supabase.from("article").insert([
      {
        id: Number(generateInt8Id()),
        title: title,
        content: content,
        json_content: JSON.stringify(jsonContent),
        created_at: new Date(),
        modified_at: new Date(),
        status: "published",
        published_date: new Date(),
        categories: categories,
        tags: tags.split(",").map((tag) => tag.trim()),
        cover_image: imageUrl || null,
      },
    ]);

    toast.success("Article published successfully!");
    setTitle("");
    setEditorContent("");
    setCategories("");
    setTags("");
    setPublishDate("");
    setImageUrl(null);
    setPreviewImage(null);
    setSelectedImage(null);
    setLocalStorageItem("editor-backup", "");
    setLocalStorageItem("editor-backup-json", "");
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
      <div className="min-h-screen bg-white  dark:bg-[#0a0a0a] w-full md:w-full ">
        {/* Header */}
        <header className="bg-white dark:bg-[#0a0a0a] shadow-sm py-4 px-4 sm:px-6 flex w-full justify-between items-center">
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Article
          </h1>
          <div className="flex items-center md:gap-2 gap-4 ml-12">
            {/* Save Draft - becomes icon on small screens */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 px-2 py-2 inline-flex md:px-14"
                  onClick={handleSaveDraft}
                >
                  <span className="hidden md:inline">Save Draft</span>
                  <Save className="h-8 w-8 grid md:hidden" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden grid">
                Save Draft
              </TooltipContent>
            </Tooltip>

            {/* Publish - becomes icon on small screens */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-9 px-2  py-2 inline-flex md:px-10"
                  onClick={handlePublish}
                >
                  <span className="hidden md:inline">Publish</span>
                  <Upload className="h-4 w-4 grid md:hidden" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden grid">
                Publish
              </TooltipContent>
            </Tooltip>

            {/* Profile picture - remains consistent */}
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#0a0a0a]">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                width={50}
                height={50}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-6 px-4 grid gap-6 md:grid-cols-3">
          {/* Article Editor (2/3 width) */}
          <div className="space-y-6 md:col-span-2">
            {/* Title Input */}
            <Card className=" md:w-full">
              <CardContent className="pt-6">
                <Input
                  placeholder="Article Title"
                  className="sm:text-2xl md:text-3xl font-bold border-none focus-visible:ring-0"
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
                  <CardContent className="pt-6 grid ">
                    {/* <div className="w-full bg-white border-1 border-gray-600 px-4 py-2 flex space-x-1">
                      <Button variant="ghost" size="icon">
                        <span className="font-bold">B</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="icon">
                        <span className="italic">I</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="icon">
                        <span className="material-icons">FB</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="icon">
                        <span className="material-icons">F</span>
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="icon">
                        <span className="material-icons">L</span>
                      </Button>
                    </div> */}

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
                            sdgParm={categories}
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
                            sdgParm={categories}
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

            {/* Categories & Tags */}
            <Card className=" md:w-full">
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Add categories and tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 grid">
                  <Label>SDG Categories</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="max-w-2xl justify-between md:w-64 w-52"
                      >
                        <span className="truncate flex-1 text-left overflow-hidden">
                          {categories.length > 0
                            ? categories
                                .map((sdg) => SDGS[sdg].title)
                                .join(", ")
                            : "Select SDGs..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search SDGs..." />
                        <CommandEmpty>No SDG found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(SDGS).map(([key, sdg]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={() => {
                                setCategories((prev) =>
                                  prev.includes(key)
                                    ? prev.filter((s) => s !== key)
                                    : [...prev, key]
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  categories.includes(key)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <img
                                  src={sdg.icon}
                                  alt={sdg.title}
                                  className="w-6 h-6"
                                  width={50}
                                  height={64}
                                />
                                {sdg.title}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {categories.length > 0 && (
                    <div
                      className="grid grid-cols-1 gap-2 mt-2 w-full
                     md:w-64"
                    >
                      {categories.map((sdgKey) => (
                        <div key={sdgKey}>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 relative md:text-md text-xs"
                          >
                            <img
                              src={SDGS[sdgKey].icon}
                              alt={SDGS[sdgKey].title}
                              className="w-4 h-4 md:w-8 md:h-8 rounded-lg"
                            />
                            {SDGS[sdgKey].title}
                            <X
                              className="w-3 h-3 ml-1 cursor-pointer absolute right-3"
                              onClick={() =>
                                setCategories((prev) =>
                                  prev.filter((s) => s !== sdgKey)
                                )
                              }
                            />
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:w-full">
                  <Label>Tags</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add tags..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className=" md:w-full">
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
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
                          <div className="text-gray-500 mb-4 text-sm md:text-md">
                            Upload an image to add as a cover image
                          </div>
                          <label
                            htmlFor="image-upload"
                            className="inline-flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 cursor-pointer 
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
            <Card className="md:w-full">
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>
                  Manage your article visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full uppercase font-bold"
                  onClick={handleFuturePublish}
                >
                  Schedule Publish
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-xs italic">
                  Kindly review your article before publishing. Ensure all
                  images are properly displayed.
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
