"use client"
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Tokens = {
    access_token: string;
    refresh_token: string;
}

type TokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export default function TokenPage() {

    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [tokens, setTokens] = useState<Tokens | null>(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Access token copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy access token: " + err);
        });
    };

    useEffect(()=>{
        const fetchTokens = async () => {
            if (!code) return;

            try {
                const response = await fetch(`/api/spotify/callback?code=${code}`);
                const data: TokenResponse = await response.json();

                if (response.ok) {
                    setTokens({
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                    });
                } else {
                    console.error("Error fetching tokens:", data);
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        };
        fetchTokens();
    }, [code]);

    if(!code) {
        return (
            <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center">
                <h1 className="text-4xl font-bold">No code provided in URL</h1>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">Your Tokens</h1>

            <p className="text-lg">Access Token: {tokens?.access_token}</p>
            <p className="text-lg">Refresh Token: {tokens?.refresh_token}</p>
        </div>
    )
}