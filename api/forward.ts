import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req.query;
  const { headers, body } = req.body;

  if (!url || Array.isArray(url)){
    return res.status(400).json({ error: 'URL not provided' });
  }
  if (Array.isArray(method)){
    return res.status(400).json({ error: 'Method not provided' });
  }


  console.log(method, url, headers, body);

  try {
    const response = await fetch(url, {
      method: (method || "GET").toUpperCase(),
      headers: headers || {},
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const responseData = await response.text();

    res.status(response.status)
    response.headers.forEach((value, key) => {
      res.setHeader(key,value)
    });

    res.send(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}