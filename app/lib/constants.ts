const clientId = process.env.SPOTIFY_CLIENT_ID;
export const redirectUri = "https://spotify-auth-gen.vercel.app/api/spotify/callback";
const encodedRedirectUri = encodeURIComponent(redirectUri);
const scopes = "user-read-currently-playing";

const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirectUri}&scope=${scopes}`;

export default { authUri };