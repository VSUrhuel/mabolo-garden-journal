import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { generateInt8Id } from "../utils/helper";

const supabase = createClient();
/**
 * A single, robust function to either insert or update an article.
 * This avoids code duplication and becomes the single source of truth.
 * @param {object} articleData - The data for the article.
 * @param {'draft' | 'published'} status - The target status of the article.
 * @returns {Promise<string|null>} The ID of the saved article, or null on failure.
 */
const upsertArticle = async (articleData : any, status: 'draft' | 'published') => {
  const { id, ...dataToSave } = articleData;
  const isNewArticle = !id;

  // Prepare the data payload
  const payload = {
    ...dataToSave,
    status: status,
    author: dataToSave.author ?? "Mabolo Admin",
    modified_at: new Date(),
    // Set published_date only when publishing
    published_date: status === 'published' ? new Date() : null,
  };

  if (isNewArticle) {
    // --- INSERT (for new articles) ---
    // Let the database generate the ID and return it with .select()
    const { data, error } = await supabase
      .from("article")
      .insert(payload)
      .select('id')
      .single(); // .single() returns one object instead of an array

    if (error) {
      toast.error(`Failed to save: ${error.message}`);
      return null;
    }
    
    toast.success("Saved successfully!");
    return data.id; // Return the NEW ID from the database

  } else {
    // --- UPDATE (for existing articles) ---
    const { error } = await supabase
      .from("article")
      .update(payload)
      .eq("id", id);

    if (error) {
      toast.error(`Failed to update: ${error.message}`);
      return null;
    }
    
    toast.success("Updated successfully!");
    return id; // Return the EXISTING ID
  }
};

// Your old functions are now simple wrappers around the new, robust function.
export const saveDraft = async (articleData: any) => {
  return await upsertArticle(articleData, 'draft');
};

export const publishArticle = async (articleData: any) => {
  return await upsertArticle(articleData, 'published');
};


export const uploadImage = async (file: any) => {
  try {
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

    const {
      data: { publicUrl },
    } = supabase.storage.from("journal-cover").getPublicUrl(filePath);

    toast.success("Image uploaded successfully");
    return publicUrl;
  } catch (error) {
    toast.error("An unexpected error occurred during image upload.");
    return null;
  } finally {
    toast.dismiss();
  }
};