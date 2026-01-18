import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
    "AI Solutions Architect",
    "GTM Strategy",
    "Voice AI",
    "Product Management",
    "Real Estate Technology",
    "Startup Advisor",
    "Software Engineering",
    "AI Integration",
    "Technical Leadership",
    "Product Development",
    "Real Estate Tech",
    "Go-to-Market",
    "Technology Blog",
    "AI Strategy",
]

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: metadataKeywords,
    authors: [
        {
            name: "Beto Juarez III",
            url: siteConfig.url,
        },
    ],
    creator: "Beto Juarez III",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@betoiii",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: siteConfig.url,
    },
};