// components/article/ArticleEditorLoader.tsx

"use client"; // This is the most important line!

import dynamic from 'next/dynamic';

// Move the dynamic import logic here
const ArticleEditor = dynamic(
  () => import('@/app/journal/editor/components/ArticleEditorForm'),
  { 
    ssr: false, // This is now allowed because we are in a client component
    loading: () => <p>Loading Editor...</p>, 
  }
);

// This component simply passes the props through to the editor
export default function ArticleEditorLoader({ article }: { article: any }) {
  return <ArticleEditor article={article} />;
}