"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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

// Define a type for the keys of the SDGS object
type SdgKey = keyof typeof SDGS;

export default function Sidebar({ article }: { article: any }) {
  const {
    categories,
    setCategories,
    tags,
    setTags,
    previewImage,
    setPreviewImage,
    setImageUrl,
    uploading,
    author, 
    setAuthor,
    handleAuthorChange,
  } = useArticleEditor(article);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setImageUrl(imageUrl);
      article.cover_image = imageUrl;
    }
  };

  return (
    <div className="space-y-6">
      <Card className=" md:w-full">
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Add categories and tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 md:w-full">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={handleAuthorChange}
              placeholder="Enter author's name..."
            />
          </div>
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
                          .map((cat: SdgKey) => SDGS[cat]?.title || cat)
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
                          setCategories((prev: SdgKey[]) =>
                            prev.includes(key as unknown as SdgKey)
                              ? prev.filter(
                                  (s) => s !== (key as unknown as SdgKey)
                                )
                              : [...prev, key as unknown as SdgKey]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            categories.includes(key as unknown as SdgKey)
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
                {categories.map((sdgKey: SdgKey) => (
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
                          setCategories((prev: SdgKey[]) =>
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
          <CardTitle>Cover Image</CardTitle>
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
                        onClick={() => setPreviewImage(null)}
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
  );
}