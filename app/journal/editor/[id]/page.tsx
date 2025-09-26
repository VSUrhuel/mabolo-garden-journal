import { createClient } from "@/utils/supabase/server";
import ArticleEditor from "../components/ArticleEditorForm";

export default async function EditArticlePage({ params }: { params: any }) {
  const supabase = createClient();
  const { data: article } = await (await supabase)
    .from("article")
    .select("*")
    .eq("id", params.id)
    .single();

  return <ArticleEditor article={article} />;
}
