import { NextResponse, NextRequest } from "next/server";
import { redirectUri } from "@/app/lib/constants";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
        }),
    });

    if (!tokenResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json(tokenData);
}