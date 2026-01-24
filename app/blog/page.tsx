import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { getCachedPosts } from "@/lib/blog-source";
import { siteConfig } from "@/lib/site";

// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description:
      "Writing about software engineering, technology, and building products that matter. Explore articles on AI, product management, and real estate technology.",
    keywords: [
      "Blog",
      "Software Engineering",
      "AI Solutions",
      "Product Management",
      "Real Estate Technology",
      "GTM Strategy",
      "Technology Articles",
      "Voice AI",
    ],
    openGraph: {
      title: "Blog - Beto's Blog",
      description:
        "Writing about software engineering, technology, and building products that matter.",
      type: "website",
      url: `${siteConfig.url}/blog`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Beto's Blog",
      description:
        "Writing about software engineering, technology, and building products that matter.",
      creator: "@betoiii",
    },
    alternates: {
      canonical: `${siteConfig.url}/blog`,
    },
  };
}

const BLUR_FADE_DELAY = 0.04;

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const allPages = await getCachedPosts();
  const sortedBlogs = allPages.sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });

  const allTags = Array.from(
    new Set(sortedBlogs.flatMap((blog) => blog.data.tags || []))
  ).sort();

  const selectedTag = resolvedSearchParams.tag;
  const filteredBlogs = selectedTag
    ? sortedBlogs.filter((blog) => blog.data.tags?.includes(selectedTag))
    : sortedBlogs;

  const featuredPost = sortedBlogs.find((blog) => blog.data.featured) || sortedBlogs[0];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding px-6 md:px-12">
        <div className="mx-auto w-full max-w-7xl relative z-10">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="inline-block mb-6 px-5 py-2 thick-border bg-primary text-primary-foreground">
              <span className="text-sm font-medium uppercase tracking-wider">Blog</span>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h1 className="mb-8">
              Thoughts & Insights
            </h1>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl leading-relaxed">
              Writing about software engineering, technology, and building products that matter.
            </p>
          </BlurFade>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent opacity-20 -z-0 transform translate-x-1/3 -rotate-6"></div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="px-6 md:px-12 pb-16 md:pb-24">
          <div className="mx-auto w-full max-w-7xl">
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl">Featured</h2>
                <div className="flex-1 h-1 bg-primary"></div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <Link
                href={featuredPost.url}
                className="group block thick-border bg-muted hover-lift overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  {featuredPost.data.thumbnail && (
                    <div className="lg:col-span-3 relative h-64 lg:h-96 overflow-hidden">
                      <Image
                        src={featuredPost.data.thumbnail}
                        alt={featuredPost.data.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </div>
                  )}
                  <div className={`${featuredPost.data.thumbnail ? 'lg:col-span-2' : 'lg:col-span-5'} p-8 md:p-12 flex flex-col justify-between bg-background`}>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="uppercase text-xs tracking-wider">Featured</Badge>
                        <time className="text-sm text-muted-foreground">
                          {formatDate(new Date(featuredPost.data.date))}
                        </time>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-serif font-medium mb-4 group-hover:text-primary transition-colors">
                        {featuredPost.data.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {featuredPost.data.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {featuredPost.data.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </BlurFade>
          </div>
        </section>
      )}

      {/* Filter Tags */}
      {allTags.length > 0 && (
        <section className="px-6 md:px-12 pb-12 bg-muted">
          <div className="mx-auto w-full max-w-7xl pt-12">
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  scroll={false}
                  className={`px-5 py-2 thick-border font-medium uppercase text-xs tracking-wider transition-all duration-300 ${
                    !selectedTag
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  All ({sortedBlogs.length})
                </Link>
                {allTags.map((tag, id) => {
                  const count = sortedBlogs.filter((blog) =>
                    blog.data.tags?.includes(tag)
                  ).length;
                  return (
                    <BlurFade key={tag} delay={BLUR_FADE_DELAY * 7 + id * 0.05}>
                      <Link
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        scroll={false}
                        className={`px-5 py-2 thick-border font-medium uppercase text-xs tracking-wider transition-all duration-300 ${
                          selectedTag === tag
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground hover:bg-foreground hover:text-background"
                        }`}
                      >
                        {tag} ({count})
                      </Link>
                    </BlurFade>
                  );
                })}
              </div>
            </BlurFade>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="section-padding px-6 md:px-12 bg-muted">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <div className="mb-12 flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl">
                {selectedTag ? `${selectedTag} Articles` : "All Articles"}
              </h2>
              <div className="flex-1 h-1 bg-accent"></div>
            </div>
          </BlurFade>

          <Suspense
            fallback={
              <div className="text-center text-muted-foreground py-12">
                Loading articles...
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, id) => {
                const date = new Date(blog.data.date);
                const formattedDate = formatDate(date);

                return (
                  <BlurFade key={blog.url} delay={BLUR_FADE_DELAY * 9 + id * 0.1}>
                    <Link
                      href={blog.url}
                      className="group block thick-border bg-background hover-lift h-full flex flex-col"
                    >
                      {blog.data.thumbnail && (
                        <div className="relative w-full h-56 overflow-hidden">
                          <Image
                            src={blog.data.thumbnail}
                            alt={blog.data.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <time className="text-xs text-muted-foreground uppercase tracking-wider">
                            {formattedDate}
                          </time>
                          {blog.data.readTime && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                {blog.data.readTime}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-serif font-medium mb-3 group-hover:text-primary transition-colors">
                          {blog.data.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex-1 mb-4">
                          {blog.data.description}
                        </p>
                        {blog.data.tags && blog.data.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.data.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-sm font-medium uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                          Read More →
                        </div>
                      </div>
                    </Link>
                  </BlurFade>
                );
              })}
            </div>

            {filteredBlogs.length === 0 && (
              <BlurFade delay={BLUR_FADE_DELAY * 9}>
                <div className="text-center py-20 thick-border bg-background">
                  <p className="text-2xl font-serif mb-4">No articles found</p>
                  <p className="text-muted-foreground mb-8">
                    {selectedTag
                      ? `No articles tagged with "${selectedTag}"`
                      : "No articles available yet"}
                  </p>
                  {selectedTag && (
                    <Link
                      href="/blog"
                      className="thick-border bg-primary text-primary-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 font-medium uppercase text-sm tracking-wider inline-block"
                    >
                      View All Articles
                    </Link>
                  )}
                </div>
              </BlurFade>
            )}
          </Suspense>
        </div>
      </section>

      {/* Newsletter CTA (Optional) */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl relative z-10">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-6 text-primary-foreground">Stay Updated</h2>
                <p className="text-xl text-primary-foreground/90 mb-8">
                  Get notified when I publish new articles about software engineering,
                  product development, and technology insights.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Link
                  href="/#contact"
                  className="thick-border border-primary-foreground bg-primary-foreground text-primary px-8 py-4 hover:bg-transparent hover:text-primary-foreground transition-all duration-300 font-medium uppercase text-sm tracking-wider inline-block"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 right-0 w-1/3 h-1/3 bg-accent opacity-20 -z-0 transform translate-x-1/2 rotate-12"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-foreground opacity-10 -z-0"></div>
      </section>
    </main>
  );
}
