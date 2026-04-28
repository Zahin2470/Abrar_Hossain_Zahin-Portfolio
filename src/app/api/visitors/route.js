import { NextResponse } from "next/server";

// countapi.mileshilliard.com
// Same URL format, completely free, no account needed, no setup.
const BASE = "https://countapi.mileshilliard.com/api/v1";
const KEY  = "zahin-portfolio-visitors";   // unique key for your portfolio

export async function GET() {
  try {
    const res = await fetch(`${BASE}/get/${KEY}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("countapi unavailable");
    const data = await res.json();

    return NextResponse.json(
      { count: parseInt(data.value ?? 0, 10) },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json({ count: null });
  }
}

export async function POST() {
  try {
    const res = await fetch(`${BASE}/hit/${KEY}`);

    if (!res.ok) throw new Error("countapi unavailable");
    const data = await res.json();

    return NextResponse.json({ count: parseInt(data.value ?? 0, 10) });
  } catch {
    return NextResponse.json({ count: null });
  }
}
