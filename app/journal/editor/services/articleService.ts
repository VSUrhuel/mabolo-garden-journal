import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { generateInt8Id } from "../utils/helper";

const supabase = createClient();

export const saveDraft = async (articleData : any, articleId = null) => {
  if (articleId) {
    const { error } = await supabase
      .from("article")
      .update({ ...articleData, status: "draft", modified_at: new Date(), published_date: null })
      .eq("id", articleId);
    if (error) {
      toast.error(`Failed to update draft: ${error.message}`);
    } else {
      toast.success("Draft updated successfully!");
    }
  } else {
    const { error } = await supabase.from("article").insert([
      {
        ...articleData,
        id: String(generateInt8Id()),
        status: "draft",
        published_date: null,
        created_at: new Date(),
        modified_at: new Date(),
      },
    ]);
    if (error) {
      toast.error(`Failed to save draft: ${error.message}`);
    } else {
      toast.success("Draft saved successfully!");
    }
  }
};

export const publishArticle = async (articleData : any, articleId = null) => {
  if (articleId) {
    const { error } = await supabase
      .from("article")
      .update({
        ...articleData,
        status: "published",
        published_date: new Date(),
        modified_at: new Date(),
      })
      .eq("id", articleId);
    if (error) {
      toast.error(`Failed to publish article: ${error.message}`);
    } else {
      toast.success("Article published successfully!");
    }
  } else {
    const { error } = await supabase.from("article").insert([
      {
        ...articleData,
        id: String(generateInt8Id()),
        status: "published",
        published_date: new Date(),
        created_at: new Date(),
        modified_at: new Date(),
      },
    ]);
    if (error) {
      toast.error(`Failed to publish article: ${error.message}`);
    } else {
      toast.success("Article published successfully!");
    }
  }
};

export const uploadImage = async (file: any) => {
  if (!file.type.startsWith("image/")) {
    toast.error("Please upload an image file (JPEG, PNG, GIF)");
    return null;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size must be less than 5MB");
    return null;
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("journal-cover")
    .upload(filePath, file);

  if (error) {
    toast.error('Failed to upload image: ' + error.message);
    return null;
  }
  toast.loading("Uploading image...");
  const {
    data: { publicUrl },
  } = supabase.storage.from("journal-cover").getPublicUrl(filePath);
  toast.dismiss();
  toast.success("Image uploaded successfully");
  return publicUrl;
};