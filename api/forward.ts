import { VercelRequest, VercelResponse } from "@vercel/node";

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  // Add more User-Agents as needed
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method, headers, body } = req;

  if (!url) {
    return res.status(400).json({ error: 'URL not provided' });
  }

  console.log(url, headers)

  if (url.length <= 1) {
    return res.status(400).json({});
  }

  const key = "/sk/"
  if (!url.startsWith(key)) {
    return res.status(400).json({});
  }

  const newUrl =  "https://" + url.substring(key.length);
  const newMethod = (method || "get").toLowerCase()
  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

  try {
    const response = await fetch(newUrl, {
      method: newMethod,
      headers: {
        'User-Agent': randomUserAgent,
      },
      body: ["get","head"].includes(newMethod)? null: body,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}