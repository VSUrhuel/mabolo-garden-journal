"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CustomImage } from "@/components/article/custom-image";
import { BubbleMenu } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/storage";
import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();

// 1. Define the type for the props
interface ArticleEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

// 2. Define the type for the ref handle
export interface EditorRefType {
  getHTML: () => string;
  getJSON: () => any; // Or use JSONContent from TipTap for stricter typing
  setContent: (html: string) => void;
  isAlive: boolean;
  destroySafely: () => void;
  restore: (content: string) => void;
}


const ArticleEditor = forwardRef<EditorRefType, ArticleEditorProps>(
  ({ initialContent, onContentChange }, ref) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [pendingUpdate, setPendingUpdate] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        emptyEditorClass: "text-gray-500",
        showOnlyWhenEditable: true,
        placeholder: "Write something …",
      }),
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent || "<p></p>",
    onDestroy: () => {
      try {
        const content = editor?.getHTML() || "";
        setLocalStorageItem("editor-backup", content);
        setLocalStorageItem("editor-backup-json", editor?.getJSON() || "");
        setPendingUpdate(content); 
      } catch (error) {
        console.error("Destruction save failed:", error);
      }
    },
  });

  useEffect(() => {
    if (pendingUpdate !== null) {
      onContentChange?.(pendingUpdate);
      setPendingUpdate(null);
    }
  }, [pendingUpdate, onContentChange]);

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || "",
    getJSON: () => editor?.getJSON(),
    setContent: (html) => editor?.commands.setContent(html),
    isAlive: !!editor && !editor.isDestroyed,
    destroySafely: () => {
      if (editor && !editor.isDestroyed) {
        editor.setOptions({ editable: false });
      }
    },
    restore: (content) => {
      if (editor && !editor.isDestroyed) {
        // Implementation for restore
      }
    },
  }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChangeImage = () => {
    setPreviewImage(null);
    setSelectedImage(null);
    setFileInputKey((prev) => prev + 1); 
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload");
      return;
    }
    const file = selectedImage;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage
        .from("journal-images")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("journal-images").getPublicUrl(filePath);

      editor
        ?.chain()
        .focus()
        .setImage({
          src: publicUrl,
        })
        .run();
      toast.success("Image inserted successfully!");

      setFileInputKey((prev) => prev + 1);
      setPreviewImage(null);
    } catch (error) {
      console.log("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[60vh] ">
      {editor && (
        <BubbleMenu editor={editor}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2 border-2">
                Insert Image
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="py-2">Insert Image</DialogTitle>

                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-2 text-center">
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
                          <Button onClick={uploadImage} disabled={uploading}>
                            {uploading ? "Uploading..." : "Insert Image"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-500 items-center mb-2">
                          Upload an image to insert
                        </div>
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center justify-center px-4 py-2 mb-2 border-2 border-dashed border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150 cursor-pointer 
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
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
});

ArticleEditor.displayName = "ArticleEditor";
export default ArticleEditor;