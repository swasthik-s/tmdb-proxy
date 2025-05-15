import type { VercelRequest, VercelResponse } from 'vercel';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.query.path;
  if (!path || typeof path !== 'string') {
    return res.status(400).send('Missing or invalid path.');
  }

  const tmdbUrl = `https://image.tmdb.org/t/p${path}`;

  try {
    const response = await axios.get(tmdbUrl, {
      responseType: 'stream',
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error: any) {
    console.error('Image Proxy Error:', error.message);
    res.status(500).send('Image fetch failed.');
  }
}
