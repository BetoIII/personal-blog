import { NextRequest, NextResponse } from "next/server";
import { clearCache } from "@/lib/portfolio-source";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// API route to refresh portfolio cache and revalidate pages
// Call this endpoint to force-refresh Notion image URLs
export async function POST(request: NextRequest) {
  try {
    // Check for authorization (optional - add your own auth logic)
    const authHeader = request.headers.get("authorization");
    const secret = process.env.PORTFOLIO_REFRESH_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear the cache
    clearCache();

    // Revalidate the portfolio page
    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Portfolio cache cleared and pages revalidated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error refreshing portfolio:", error);
    return NextResponse.json(
      { error: "Failed to refresh portfolio" },
      { status: 500 }
    );
  }
}

// Also support GET for manual browser refresh
export async function GET() {
  clearCache();
  revalidatePath("/portfolio");
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    message: "Portfolio cache cleared (public endpoint - use POST with auth for production)",
    timestamp: new Date().toISOString(),
  });
}
