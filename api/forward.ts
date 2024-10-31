import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method, headers } = req;
  const rawBody = await req.read();

  if (!url) {
    return res.status(400).json({ error: 'URL not provided' });
  }

  if (url.length <= 1) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const key = "/sk/";
  if (!url.startsWith(key)) {
    return res.status(200).json({});
  }

  const newUrl = "https://" + url.substring(key.length);
  const newMethod = (method || "GET").toUpperCase();

  let newHeaders: { [key: string]: string } = {};

  for (let k in headers) {
    const keyLower = k.toLowerCase();
    if (keyLower.startsWith("x-vercel") || keyLower.startsWith("cf-") || keyLower.startsWith("x-forwarded-") || ["content-length", "x-real-ip", "forwarded", "host"].includes(keyLower)) {
      continue;
    }
    if (headers[k]) {
      newHeaders[keyLower] = (headers[k] ?? "").toString();
    }
  }

  console.log(newMethod, newUrl, newHeaders, rawBody);

  try {
    const response = await fetch(newUrl, {
      method: newMethod,
      headers: newHeaders,
      body: ["GET", "HEAD"].includes(newMethod) ? null : rawBody,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.text();

    console.log(response.headers)

    res.status(response.status).send(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}
