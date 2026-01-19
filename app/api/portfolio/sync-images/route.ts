import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/lib/notion-portfolio";
import { syncProjectImage, loadBlobCache, clearProjectCache } from "@/lib/blob-storage";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for long-running sync

interface SyncResult {
  projectSlug: string;
  success: boolean;
  blobUrl?: string;
  error?: string;
}

// Sync all portfolio images to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    // Optional: Check for authorization
    const authHeader = request.headers.get("authorization");
    const secret = process.env.PORTFOLIO_REFRESH_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const forceSync = url.searchParams.get("force") === "true";
    const projectSlug = url.searchParams.get("project");

    console.log("Starting portfolio image sync...");
    console.log(`Force sync: ${forceSync}`);
    console.log(`Project filter: ${projectSlug || "all"}`);

    // Fetch all projects from Notion
    const projects = await getAllProjects();
    console.log(`Found ${projects.length} projects in Notion`);

    // Filter to specific project if requested
    const projectsToSync = projectSlug
      ? projects.filter(p => p.slug === projectSlug)
      : projects;

    if (projectsToSync.length === 0) {
      return NextResponse.json({
        error: projectSlug
          ? `Project "${projectSlug}" not found`
          : "No projects found",
      }, { status: 404 });
    }

    const results: SyncResult[] = [];

    // Sync each project's image
    for (const project of projectsToSync) {
      try {
        // Skip if no thumbnail
        if (!project.thumbnail) {
          console.log(`Skipping ${project.slug} - no thumbnail`);
          results.push({
            projectSlug: project.slug,
            success: true,
            error: "No thumbnail",
          });
          continue;
        }

        // Clear cache if force sync
        if (forceSync) {
          console.log(`Force syncing ${project.slug}...`);
          await clearProjectCache(project.slug);
        }

        // Sync image
        const blobUrl = await syncProjectImage(project.slug, project.thumbnail);

        if (blobUrl) {
          results.push({
            projectSlug: project.slug,
            success: true,
            blobUrl,
          });
        } else {
          results.push({
            projectSlug: project.slug,
            success: false,
            error: "Failed to upload to blob storage",
          });
        }
      } catch (error) {
        console.error(`Error syncing ${project.slug}:`, error);
        results.push({
          projectSlug: project.slug,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Revalidate pages
    revalidatePath("/portfolio");
    revalidatePath("/");

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Sync complete: ${successCount} success, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Synced ${successCount}/${projectsToSync.length} images`,
      results,
      stats: {
        total: projectsToSync.length,
        success: successCount,
        failed: failCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error syncing portfolio images:", error);
    return NextResponse.json(
      {
        error: "Failed to sync portfolio images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    const cache = await loadBlobCache();
    const entries = Object.values(cache);

    return NextResponse.json({
      success: true,
      cachedImages: entries.length,
      cache: entries.map(entry => ({
        projectSlug: entry.projectSlug,
        blobUrl: entry.blobUrl,
        uploadedAt: entry.uploadedAt,
      })),
    });
  } catch (error) {
    console.error("Error loading blob cache:", error);
    return NextResponse.json(
      { error: "Failed to load cache" },
      { status: 500 }
    );
  }
}
