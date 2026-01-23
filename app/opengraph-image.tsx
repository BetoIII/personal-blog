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

    const [clashDisplayRes, cabinetGroteskRes, avatarRes] = await Promise.all([
      fetch(fontUrls.clashDisplay),
      fetch(fontUrls.cabinetGrotesk),
      fetch(`${baseUrl}/avatar.png`),
    ]);

    if (!clashDisplayRes.ok || !cabinetGroteskRes.ok) {
      return null;
    }

    const [clashDisplay, cabinetGrotesk] = await Promise.all([
      clashDisplayRes.arrayBuffer(),
      cabinetGroteskRes.arrayBuffer(),
    ]);

    const avatarBase64 = avatarRes.ok
      ? `data:image/png;base64,${Buffer.from(await avatarRes.arrayBuffer()).toString("base64")}`
      : null;

    return {
      clashDisplay,
      cabinetGrotesk,
      avatarBase64,
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
    backgroundColor: "#FAF7F2",
    padding: "50px",
  },
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    border: "4px solid #1A1A1A",
    backgroundColor: "#FFFFFF",
    padding: "60px",
    gap: "60px",
  },
  leftContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "20px",
  },
  title: {
    fontSize: "68px",
    fontWeight: "500",
    color: "#1A1A1A",
    lineHeight: "1",
    fontFamily: "Clash Display",
    letterSpacing: "-2px",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "24px",
    color: "#4A4A4A",
    fontFamily: "Clash Display",
    lineHeight: "1.3",
    fontWeight: "500",
    maxWidth: "600px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#D4573B",
    color: "#FAF7F2",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Clash Display",
    textTransform: "uppercase",
    letterSpacing: "1px",
    alignSelf: "flex-start",
  },
  avatarContainer: {
    display: "flex",
    position: "relative",
    width: "280px",
    height: "280px",
  },
  avatar: {
    width: "280px",
    height: "280px",
    border: "4px solid #1A1A1A",
    objectFit: "cover",
  },
  accentBox: {
    position: "absolute",
    width: "280px",
    height: "280px",
    backgroundColor: "#6B7A5A",
    border: "4px solid #1A1A1A",
    top: "-20px",
    left: "-20px",
    zIndex: "-1",
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
            <div style={styles.leftContent}>
              <div style={styles.badge}>Portfolio & Blog</div>
              <h1 style={styles.title}>Beto Juárez III</h1>
              <p style={styles.subtitle}>
                GTM & AI Advisor · Product Leader · Software Engineer
              </p>
            </div>
            {assetData?.avatarBase64 && (
              <div style={styles.avatarContainer}>
                <div style={styles.accentBox}></div>
                <img
                  src={assetData.avatarBase64}
                  alt="Beto Juárez III"
                  style={styles.avatar}
                />
              </div>
            )}
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
