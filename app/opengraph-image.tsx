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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

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

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "60px",
  },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "80px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "72px",
    fontWeight: "bold",
    color: "#5a67d8",
    marginBottom: "24px",
    textAlign: "center",
    fontFamily: "Clash Display",
    letterSpacing: "-1px",
  },
  description: {
    fontSize: "32px",
    color: "#4a5568",
    textAlign: "center",
    maxWidth: "900px",
    fontFamily: "Clash Display",
    lineHeight: "1.4",
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: "40px",
    right: "40px",
    backgroundColor: "#667eea",
    color: "white",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "Clash Display",
  },
} as const;

export default async function Image() {
  try {
    const assetData = await getAssetData();

    return new ImageResponse(
      (
        <div
          style={{
            ...styles.wrapper,
            fontFamily: assetData ? "Clash Display" : "system-ui",
          }}
        >
          <div style={styles.container}>
            <div style={styles.badge}>Portfolio</div>
            <h1 style={styles.title}>Beto Juárez III</h1>
            <p style={styles.description}>
              GTM & AI Advisor | Product Leader | Software Engineer
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
              {
                name: "Cabinet Grotesk",
                data: assetData.cabinetGrotesk,
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
