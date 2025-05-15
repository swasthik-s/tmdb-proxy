import type { VercelRequest, VercelResponse } from 'vercel';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // or specific origin like 'http://localhost:3001'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Pre-flight request
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const endpoint = req.query.endpoint;

  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid endpoint parameter' });
  }

  const tmdbURL = new URL(`https://api.themoviedb.org/3/${endpoint}`);

  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'endpoint') {
      tmdbURL.searchParams.append(key, value as string);
    }
  }

  tmdbURL.searchParams.append('api_key', TMDB_API_KEY!);

  try {
    const { data } = await axios.get(tmdbURL.toString());
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('TMDB Proxy Error:', error.message);
    return res.status(500).json({ error: 'Proxy fetch failed', message: error.message });
  }
}
