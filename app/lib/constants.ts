const clientId = process.env.SPOTIFY_CLIENT_ID;
const encodedRedirectUri = "https%3A%2F%2Fspotify-auth-gen.vercel.app%2Fapi%2Fspotify%2Fcallback";
export const redirectUri = "https://spotify-auth-gen.vercel.app/api/spotify/callback";
const scopes = "user-read-currently-playing";

const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirectUri}&scope=${scopes}`;

export default { authUri };