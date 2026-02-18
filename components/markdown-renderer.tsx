"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (children !== null && typeof children === "object" && "props" in children) {
    return getTextContent((children as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}

function CopyCodeBlock({ code, language, children }: { code: string; language: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-2 right-2 z-10 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      {children}
    </div>
  );
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
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-p:tracking-tight prose-p:text-lg prose-headings:text-2xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children, ...props }) {
            const id = slugify(getTextContent(children));
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3({ children, ...props }) {
            const id = slugify(getTextContent(children));
            return <h3 id={id} {...props}>{children}</h3>;
          },
          code({ inline, className, children, ...props }: {inline?: boolean; className?: string; children?: React.ReactNode}) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");
            return !inline && match ? (
              <CopyCodeBlock code={codeText} language={match[1]}>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeText}
                </SyntaxHighlighter>
              </CopyCodeBlock>
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
