import { NextResponse } from "next/server";

const USERNAME = "Zahin2470";
const BASE     = "https://api.github.com";

// Optional: add Zahin API Token GitHub to Vercel env vars to raise rate limit 60→5000/hr
const headers = () => {
  const h = {
    "Accept":               "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent":           "zahin-portfolio",
  };
  if (process.env.ZAHIN_GITHUB_TOKEN) h["Authorization"] = `Bearer ${process.env.ZAHIN_GITHUB_TOKEN}`;
  return h;
};

export async function GET() {
  try {
    const h = headers();

    // Parallel fetch: user profile + repos
    const [userRes, reposRes] = await Promise.all([
      fetch(`${BASE}/users/${USERNAME}`,                              { headers: h, next: { revalidate: 3600 } }),
      fetch(`${BASE}/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers: h, next: { revalidate: 3600 } }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error(`GitHub API error: ${userRes.status} / ${reposRes.status}`);
    }

    const user  = await userRes.json();
    const repos = await reposRes.json();

    // Filter out forks, sort by stars
    const ownRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Top 5 repos by stars
    const topRepos = ownRepos.slice(0, 6).map(r => ({
      name:        r.name,
      description: r.description,
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      language:    r.language,
      url:         r.html_url,
      updatedAt:   r.updated_at,
    }));

    // Language totals (count repos per language)
    const langCount = {};
    ownRepos.forEach(r => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const totalLangRepos = Object.values(langCount).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / totalLangRepos) * 100) }));

    // Total stars across all own repos
    const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

    return NextResponse.json({
      profile: {
        login:      user.login,
        name:       user.name,
        bio:        user.bio,
        avatar:     user.avatar_url,
        followers:  user.followers,
        following:  user.following,
        publicRepos:user.public_repos,
        profileUrl: user.html_url,
        createdAt:  user.created_at,
      },
      stats: {
        totalStars,
        totalForks,
        totalRepos: ownRepos.length,
      },
      topRepos,
      topLanguages,
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });

  } catch (err) {
    console.error("Zahin GitHub API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
