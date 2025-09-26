import Hero from "@/components/common/hero";
import ArticlePost from "@/components/article/article-posts";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        {/* <ArticlePost /> */}
        <ArticlePost />
      </main>
    </>
  );
}
