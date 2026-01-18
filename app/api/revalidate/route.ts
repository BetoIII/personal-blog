import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { clearCache } from "@/lib/blog-source";

// Secret token for authentication (set this in your environment)
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Check for secret token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    // If REVALIDATION_SECRET is set, require it
    if (REVALIDATION_SECRET && token !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Parse the body (optional - can include specific paths)
    let body: { path?: string; slug?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional
    }

    // Clear the in-memory cache
    clearCache();

    // Revalidate specific path or all blog paths
    if (body.slug) {
      // Revalidate specific blog post
      revalidatePath(`/blog/${body.slug}`);
      console.log(`Revalidated: /blog/${body.slug}`);
    } else if (body.path) {
      // Revalidate custom path
      revalidatePath(body.path);
      console.log(`Revalidated: ${body.path}`);
    } else {
      // Revalidate all blog pages
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
      revalidatePath("/", "page"); // Homepage might show blog posts
      console.log("Revalidated all blog paths");
    }

    // Also revalidate any tagged caches
    try {
      revalidateTag("blog-posts");
    } catch {
      // Tag may not exist
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: "Cache cleared and pages revalidated",
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for simple webhook triggers
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // If REVALIDATION_SECRET is set, require it
  if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }

  // Clear cache and revalidate
  clearCache();
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/", "page");

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  });
}
