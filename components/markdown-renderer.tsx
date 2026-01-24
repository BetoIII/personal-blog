"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

// Component to render Spotify embeds
function SpotifyEmbed({ url }: { url: string }) {
  return (
    <div className="my-8 w-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={url}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full"
      />
    </div>
  );
}

// Component to render YouTube embeds
function YouTubeEmbed({ url }: { url: string }) {
  return (
    <div className="my-8 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: {inline?: boolean; className?: string; children?: React.ReactNode}) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          p({ children, ...props }) {
            // Check if the paragraph only contains an embed link
            // If so, render it without the paragraph wrapper to avoid nesting div inside p
            const childArray = Array.isArray(children) ? children : [children];

            // Check if this paragraph contains only a single child that's a link
            if (childArray.length === 1) {
              const child = childArray[0];
              // Check if it's a React element with type 'a' and has embed marker text
              if (typeof child === 'object' && child !== null && 'props' in child) {
                const childProps = child.props;
                if (childProps?.children) {
                  const childText = String(childProps.children);
                  if (childText === "spotify-embed" || childText === "youtube-embed" || childText === "embed") {
                    // This is an embed link, render it directly without the paragraph wrapper
                    return <>{children}</>;
                  }
                }
              }
            }

            // Regular paragraph
            return <p {...props}>{children}</p>;
          },
          a({ href, children, ...props }) {
            // Handle custom embed markers
            const childText = String(children);

            // Spotify embed
            if (childText === "spotify-embed" && href) {
              return <SpotifyEmbed url={href} />;
            }

            // YouTube embed
            if (childText === "youtube-embed" && href) {
              return <YouTubeEmbed url={href} />;
            }

            // Generic embed fallback
            if (childText === "embed" && href) {
              return (
                <div className="my-8 p-4 border border-border rounded-lg">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View embedded content: {href}
                  </a>
                </div>
              );
            }

            // Regular link
            return (
              <a href={href} {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
