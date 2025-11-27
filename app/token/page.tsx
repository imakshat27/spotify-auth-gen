"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Tokens = {
  access_token: string;
  refresh_token: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg
          aria-hidden="true"
          className="w-12 h-12 animate-spin text-white"
          viewBox="0 0 50 50"
          fill="none"
        >
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" strokeOpacity="0.2" />
          <path d="M45 25a20 20 0 00-20-20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div className="text-lg">Fetching tokens…</div>
      </div>
    </div>
  );
}

/**
 * TokenViewer
 * - contains the original effect+UI that fetches tokens and displays them.
 * - kept as a separate component so it can be wrapped with Suspense above.
 */
function TokenViewer() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [tokens, setTokens] = useState<Tokens | null>(null);

  const copyToClipboard = (text: string, label = "text") => {
    if (!text) {
      alert(`Nothing to copy (${label})`);
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(`${label} copied to clipboard!`);
      })
      .catch((err) => {
        alert(`Failed to copy ${label}: ` + String(err));
      });
  };

  useEffect(() => {
    const fetchTokens = async () => {
      if (!code) return;

      try {
        const response = await fetch(`/api/spotify/callback?code=${encodeURIComponent(code)}`);
        const data: TokenResponse = await response.json();

        if (response.ok) {
          setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
        } else {
          console.error("Error fetching tokens:", data);
          alert("Error fetching tokens: " + ((data as any).error_description || "Unknown error"));
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error while fetching tokens");
      }
    };
    fetchTokens();
  }, [code]);

  if (!code) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">No code provided in URL</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Your Tokens</h1>

      <div className="w-full max-w-3xl bg-slate-800 rounded-xl p-6 shadow-lg space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Access Token</h2>
            <p className="text-sm text-slate-300 mt-1">Used for API requests (Bearer token).</p>
          </div>
          <div className="text-sm text-slate-300">{tokens?.access_token ? `${tokens.access_token.length} chars` : "—"}</div>
        </div>

        <pre className="whitespace-pre-wrap bg-slate-900 rounded-md p-4 text-sm font-mono break-words">
          {tokens?.access_token ?? "No access token yet."}
        </pre>

        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(tokens?.access_token ?? "", "Access token")}
            className="px-4 py-2 bg-emerald-600 rounded text-white shadow-sm hover:opacity-95"
          >
            Copy Access Token
          </button>

          <button
            onClick={() => {
              if (!tokens) return alert("No tokens to download");
              const blob = new Blob(
                [
                  `access_token: ${tokens.access_token}\nrefresh_token: ${tokens.refresh_token}\n`,
                ],
                { type: "text/plain" }
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "spotify-tokens.txt";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-sky-600 rounded text-white shadow-sm hover:opacity-95"
          >
            Download Tokens
          </button>
        </div>

        <hr className="border-slate-700" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Refresh Token</h2>
            <p className="text-sm text-slate-300 mt-1">Use this to request new access tokens.</p>
          </div>
          <div className="text-sm text-slate-300">{tokens?.refresh_token ? `${tokens.refresh_token.length} chars` : "—"}</div>
        </div>

        <pre className="whitespace-pre-wrap bg-slate-900 rounded-md p-4 text-sm font-mono break-words">
          {tokens?.refresh_token ?? "No refresh token yet."}
        </pre>

        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(tokens?.refresh_token ?? "", "Refresh token")}
            className="px-4 py-2 bg-emerald-600 rounded text-white shadow-sm hover:opacity-95"
          >
            Copy Refresh Token
          </button>
          <button
            onClick={() => {
              setTokens(null);
              alert("Tokens cleared from UI memory.");
            }}
            className="px-4 py-2 bg-white text-slate-900 rounded shadow-sm hover:bg-slate-50"
          >
            Clear Tokens
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * TokenPage
 * - outer component that wraps TokenViewer in a Suspense boundary
 */
export default function TokenPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TokenViewer />
    </Suspense>
  );
}
