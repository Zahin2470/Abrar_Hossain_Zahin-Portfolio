import { NextResponse } from "next/server";

// Uses countapi.xyz — completely free, no account, no setup needed.
// Namespace is unique to your portfolio so counts are isolated.
const NAMESPACE = "zahin-portfolio";
const KEY = "visitors";

export async function GET() {
  try {
    // Hit countapi to get current count (read only, no increment)
    const res = await fetch(
      `https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`,
      { next: { revalidate: 60 } } // cache for 60s
    );

    if (!res.ok) throw new Error("countapi unavailable");
    const data = await res.json();

    return NextResponse.json(
      { count: data.value ?? 0 },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json({ count: null });
  }
}

export async function POST() {
  try {
    // Increment and return new count
    const res = await fetch(
      `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`
    );

    if (!res.ok) throw new Error("countapi unavailable");
    const data = await res.json();

    return NextResponse.json({ count: data.value ?? 0 });
  } catch {
    return NextResponse.json({ count: null });
  }
}
