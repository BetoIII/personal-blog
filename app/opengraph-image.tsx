import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Beto Juárez III";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const getAssetData = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://betoiii.com";

    const fontUrls = {
      clashDisplay: `${baseUrl}/fonts/ClashDisplay-Semibold.ttf`,
      cabinetGrotesk: `${baseUrl}/fonts/CabinetGrotesk-Medium.ttf`,
    };

    const [clashDisplayRes, cabinetGroteskRes] = await Promise.all([
      fetch(fontUrls.clashDisplay),
      fetch(fontUrls.cabinetGrotesk),
    ]);

    if (!clashDisplayRes.ok || !cabinetGroteskRes.ok) {
      return null;
    }

    const [clashDisplay, cabinetGrotesk] = await Promise.all([
      clashDisplayRes.arrayBuffer(),
      cabinetGroteskRes.arrayBuffer(),
    ]);

    return {
      clashDisplay,
      cabinetGrotesk,
    };
  } catch (error) {
    console.error("Failed to load assets:", error);
    return null;
  }
};

export default async function Image() {
  try {
    const assetData = await getAssetData();

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF7F2",
            fontFamily: assetData ? "Clash Display" : "system-ui",
            padding: "50px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              border: "4px solid #1A1A1A",
              backgroundColor: "#FFFFFF",
              padding: "60px 80px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#D4573B",
                color: "#FAF7F2",
                padding: "12px 24px",
                fontSize: "18px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "30px",
              }}
            >
              Portfolio & Blog
            </div>
            <h1
              style={{
                fontSize: "80px",
                fontWeight: "500",
                color: "#1A1A1A",
                lineHeight: "1",
                letterSpacing: "-2px",
                marginBottom: "20px",
                margin: "0",
              }}
            >
              Beto Juárez III
            </h1>
            <p
              style={{
                fontSize: "32px",
                color: "#4A4A4A",
                lineHeight: "1.3",
                fontWeight: "500",
                margin: "0",
              }}
            >
              GTM & AI Advisor · Product Leader · Software Engineer
            </p>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: assetData
          ? [
              {
                name: "Clash Display",
                data: assetData.clashDisplay,
                weight: 500,
                style: "normal",
              },
            ]
          : undefined,
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      `Failed to generate image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        status: 500,
      }
    );
  }
}
