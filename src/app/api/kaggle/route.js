import { NextResponse } from "next/server";

// ==================== CONFIG ====================
const KAGGLE_USERNAME = process.env.KAGGLE_USERNAME;
const KAGGLE_KEY = process.env.KAGGLE_KEY;

// Tier colors
const TIER_CONFIG = {
  Novice:      { label: "Novice",      color: "#6b7280" },
  Contributor: { label: "Contributor", color: "#3b82f6" },
  Expert:      { label: "Expert",      color: "#8b5cf6" },
  Master:      { label: "Master",      color: "#f59e0b" },
  Grandmaster: { label: "Grandmaster", color: "#ef4444" },
};

// Enhanced Fallback Data with your requested values
const FALLBACK_DATA = {
  displayName: "Abrar Hossain Zahin",
  username: "mdabrarhossainzahin",
  tier: "Contributor",
  tierColor: "#3b82f6",
  totalVotes: 201,        // ← Updated
  followers: 5,           // ← Updated
  following: 0,           // ← Updated
  forks: 331,             // ← New field added
  profileUrl: "https://www.kaggle.com/mdabrarhossainzahin",
  avatarUrl: null,
  medals: {
    competitions: { gold: 0, silver: 0, bronze: 0 },
    notebooks:    { gold: 0, silver: 0, bronze: 2 },
    datasets:     { gold: 0, silver: 0, bronze: 0 },
    discussions:  { gold: 0, silver: 0, bronze: 0 },
  },
  isLive: false,
  message: "Add KAGGLE_USERNAME and KAGGLE_KEY in Vercel Environment Variables for live data",
};

// ==================== MAIN ROUTE ====================
export async function GET() {
  try {
    // If credentials are not set, return enhanced fallback
    if (!KAGGLE_USERNAME || !KAGGLE_KEY) {
      return NextResponse.json(FALLBACK_DATA, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      });
    }

    const authHeader = "Basic " + Buffer.from(`${KAGGLE_USERNAME}:${KAGGLE_KEY}`).toString("base64");

    const response = await fetch(
      `https://www.kaggle.com/api/v1/users/${KAGGLE_USERNAME}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`Kaggle API Error: ${response.status}`);
      return NextResponse.json(FALLBACK_DATA, { status: 200 });
    }

    const profile = await response.json();

    const getMedals = (tier) => ({
      gold: tier?.goldMedals || 0,
      silver: tier?.silverMedals || 0,
      bronze: tier?.bronzeMedals || 0,
    });

    const data = {
      displayName: profile.displayName || "Abrar Hossain Zahin",
      username: profile.userName || KAGGLE_USERNAME,
      tier: profile.tier || "Contributor",
      tierColor: TIER_CONFIG[profile.tier]?.color || "#3b82f6",
      totalVotes: profile.totalVotes || 201,
      followers: profile.followersCount || 5,
      following: profile.followingCount || 0,
      forks: 331,                    // ← Added as requested
      profileUrl: `https://www.kaggle.com/${KAGGLE_USERNAME}`,
      avatarUrl: profile.thumbnailUrl || null,
      medals: {
        competitions: getMedals(profile.competitionsTier),
        notebooks:    getMedals(profile.scriptsTier),
        datasets:     getMedals(profile.datasetsTier),
        discussions:  getMedals(profile.forumsTier),
      },
      isLive: true,
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });

  } catch (error) {
    console.error("Kaggle API Route Error:", error);
    return NextResponse.json(FALLBACK_DATA, { status: 200 });
  }
}