"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ArticleEditor from "@/components/article/article-editor";
import PreviewArticle from "@/components/common/preview-article";
import useArticleEditor from "../hooks/useArticleEditor";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button"; // Import the Button component

export default function ArticleEditorForm(article) {
  const {
    title,
    setTitle,
    publishDate,
    categories,
    tags,
    editorContent,
    imageUrl,
    editorRef,
    isEditorReady,
    handleContentChange,
    handlePreview,
    getContent,
    handleSaveDraft,
    handlePublish,
  } = useArticleEditor(article);

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {article.title ? "Edit Article" : "New Article"}
          </h1>
          <p className="text-gray-600">
            {article.title
              ? `Editing article: ${article.title}`
              : "Create a new article to share your thoughts and ideas."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={title.trim() === ""}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button disabled={title.trim() === ""} onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
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
                  <ArticleEditor
                    ref={editorRef}
                    initialContent={editorContent}
                    onContentChange={handleContentChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <Card>
                <CardContent className="pt-6 prose max-w-none">
                  {(() => {
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
                    }

                    return (
                      <div className="text-gray-500 italic">
                        {isEditorReady
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

        <Sidebar article={article} />
      </div>
    </main>
  );
}