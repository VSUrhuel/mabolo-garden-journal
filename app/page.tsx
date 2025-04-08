import Hero from "@/components/hero";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";

import ArticlePost from "@/components/article-posts";

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
