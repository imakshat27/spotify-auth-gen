const clientId = process.env.SPOTIFY_CLIENT_ID;
export const redirectUri = "https%3A%2F%2Fspotify-auth-gen.vercel.app%2Fapi%2Fspotify%2Fcallback";
const scopes = "user-read-currently-playing";

const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

export default { authUri };