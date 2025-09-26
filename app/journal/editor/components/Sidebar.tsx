"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useArticleEditor from "../hooks/useArticleEditor";
import { SDGS } from "../utils/constants";
import { uploadImage } from "../services/articleService";
import { useState } from "react";

// Define a type for the keys of the SDGS object
type SdgKey = keyof typeof SDGS;

export default function Sidebar({ article }: { article: any }) {
  // 1. FIXED: Destructure only what's needed. Avoid direct setters like setCategories.
  // Use the handlers from the hook to ensure localStorage is updated.
  const {
    categories,
    tags,
    previewImage,
    setPreviewImage, // Kept for local UI state
    setImageUrl,
    uploading,
    setUploading, // Kept for local UI state
    author,
    handleAuthorChange,
    handleTagsChange,
    handleCategoriesChange,
  } = useArticleEditor(article);

  // Use a key to reset the file input after a selection
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setPreviewImage(imageUrl);
        setImageUrl(imageUrl);
        // 2. FIXED: Removed direct prop mutation `article.cover_image = imageUrl;`
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      // Optionally, show a toast notification for the error
    } finally {
      setUploading(false);
      // Reset the file input so the user can select the same file again if needed
      setFileInputKey(Date.now());
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Add categories and tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={handleAuthorChange}
              placeholder="Enter author's name"
            />
          </div>

          <div className="space-y-2">
            <Label>SDG Categories</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  <span className="truncate">
                    {(categories?.length || 0) > 0
                      ? categories
                          .map((cat: SdgKey) => SDGS[cat]?.title || cat)
                          .join(", ")
                      : "Select SDGs..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search SDGs..." />
                  <CommandEmpty>No SDG found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(SDGS).map(([key, sdg]) => {
                      const sdgKey = key as unknown as SdgKey;
                      const isSelected = categories?.includes(sdgKey);

                      return (
                        <CommandItem
                          key={sdgKey}
                          value={sdg.title} // Search by title
                          onSelect={() => {
                            const newCategories = isSelected
                              ? categories.filter((s:any) => s !== sdgKey)
                              : [...(categories || []), sdgKey];
                            handleCategoriesChange(newCategories);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <img src={sdg.icon} alt={sdg.title} className="w-6 h-6" />
                            <span>{sdg.title}</span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 pt-2">
              {(categories || []).map((sdgKey: SdgKey) => (
                <Badge
                  key={sdgKey}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <img src={SDGS[sdgKey]?.icon} className="w-4 h-4" />
                  <span>{SDGS[sdgKey]?.title}</span>
                  <button
                    onClick={() => {
                      const newCategories = categories.filter((s:any) => s !== sdgKey);
                      handleCategoriesChange(newCategories);
                    }}
                    className="rounded-full hover:bg-muted"
                    aria-label={`Remove ${SDGS[sdgKey]?.title}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add tags, separated by commas"
              value={tags}
              onChange={handleTagsChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {previewImage ? (
              <div className="space-y-4">
                <img
                  src={previewImage}
                  alt="Cover image preview"
                  className="max-h-48 w-full object-contain rounded-md"
                />
                <label
                  htmlFor="image-upload"
                  className={cn(
                    "cursor-pointer text-sm text-blue-600 hover:underline",
                    uploading && "pointer-events-none opacity-50"
                  )}
                >
                  {uploading ? "Uploading..." : "Change Image"}
                </label>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
              >
                <svg /* Icon SVG */ className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-medium text-blue-600">Click to upload</span>
                <p className="text-xs text-gray-500">JPG, PNG, GIF (Max 5MB)</p>
              </label>
            )}
            <input
              id="image-upload"
              key={fileInputKey}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="sr-only"
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}