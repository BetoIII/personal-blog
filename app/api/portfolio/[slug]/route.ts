import { NextResponse } from "next/server";
import { notionPortfolioSource } from "@/lib/portfolio-source";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const { slug } = params;

    console.log("[API] Fetching project content for slug:", slug);

    if (!slug) {
      console.error("[API] No slug provided");
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const project = await notionPortfolioSource.getProject(slug);

    if (!project) {
      console.error("[API] Project not found:", slug);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("[API] Successfully fetched content for:", slug);
    return NextResponse.json({
      content: project.content,
    });
  } catch (error) {
    console.error("[API] Error fetching project:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch project",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
