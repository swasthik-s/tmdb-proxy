import type { VercelRequest, VercelResponse } from 'vercel';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.query.path;

  if (!path || typeof path !== 'string') {
    return res.status(400).send('Missing or invalid "path" query.');
  }

  const tmdbUrl = `https://image.tmdb.org/t/p${path}`;

  try {
    const response = await axios.get(tmdbUrl, { responseType: 'stream' });

    // Check if it's an image
    const contentType = response.headers['content-type'];
    if (!contentType?.startsWith('image/')) {
      return res.status(404).send('The requested resource is not an image.');
    }

    res.setHeader('Content-Type', contentType);
    response.data.pipe(res);
  } catch (error: any) {
    console.error('Image proxy error:', error.message);
    return res.status(404).send('Image not found or blocked.');
  }
}
