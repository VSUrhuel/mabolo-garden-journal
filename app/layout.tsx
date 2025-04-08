import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { LucideGithub, LucideLinkedin, LucideTwitch } from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main
            className="min-h-screen flex flex-col items-center"
            aria-hidden={undefined}
          >
            <div className="flex-1 w-full flex flex-col gap-10 md:gap-0 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Jarden de Mabolo Journal</Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex flex-col gap-0 max-w-5xl w-full p-2">
                {children}
              </div>

              <footer className="w-full border-t py-12 bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 max-w-5xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm uppercase tracking-wider">
                        Contact Us
                      </h3>
                      <address className="not-italic text-gray-600 dark:text-gray-400">
                        <p>Mabolo Men's Home</p>
                        <p>Visca, Baybay City, Leyte</p>
                        <p className="mt-2">
                          <a
                            href="mailto:mabolo2025@gmail.com"
                            className="hover:underline"
                          >
                            mabolo2025@gmail.com
                          </a>
                        </p>
                        <p>
                          <a href="tel:+1234567890" className="hover:underline">
                            +63 (909) 915-3546
                          </a>
                        </p>
                      </address>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm uppercase tracking-wider">
                        Quick Links
                      </h3>
                      <nav>
                        <ul className="space-y-1">
                          <li>
                            <a
                              href="/about"
                              className="hover:underline text-gray-600 dark:text-gray-400"
                            >
                              About
                            </a>
                          </li>
                          <li>
                            <a
                              href="/blog"
                              className="hover:underline text-gray-600 dark:text-gray-400"
                            >
                              Blog
                            </a>
                          </li>
                          <li>
                            <a
                              href="/privacy"
                              className="hover:underline text-gray-600 dark:text-gray-400"
                            >
                              Privacy Policy
                            </a>
                          </li>
                          <li>
                            <a
                              href="/terms"
                              className="hover:underline text-gray-600 dark:text-gray-400"
                            >
                              Terms of Service
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>

                    {/* Social & Credits */}
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <a
                          href="https://twitter.com/yourhandle"
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <span className="sr-only">Twitter</span>
                          <LucideTwitch className="h-5 w-5" />{" "}
                          {/* Replace with your icon component */}
                        </a>
                        <a
                          href="https://github.com/yourprofile"
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <span className="sr-only">GitHub</span>
                          <LucideGithub className="h-5 w-5" />{" "}
                          {/* Replace with your icon component */}
                        </a>
                        <a
                          href="https://linkedin.com/in/jrlaurente"
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <LucideLinkedin className="h-5 w-5" />{" "}
                          {/* Replace with your icon component */}
                        </a>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <p>
                          Powered by{" "}
                          <a
                            href="https://supabase.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold hover:underline"
                          >
                            Supabase
                          </a>
                        </p>
                        <p>
                          © 2024{" "}
                          <a
                            href="https://linkedin.com/in/jrlaurente"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold hover:underline"
                          >
                            John Ruel Laurente
                          </a>
                          . All rights reserved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
