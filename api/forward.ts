import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {url, method} = req.query;

  if (!url || Array.isArray(url)){
    return res.status(400).json({ error: 'URL not provided' });
  }
  if (Array.isArray(method)){
    return res.status(400).json({ error: 'Method not provided' });
  }
  const body = req.body;
  const newMethod = (method || "GET").toUpperCase()
  let newBody:string|null = null
  
  let newHeaders :{
    [p:string]:string
  } = body.headers || {}

  if (body && newMethod!= "GET" && newMethod!= "HEAD"){
    newBody = JSON.stringify(body)
  }


  console.log(newMethod, url, newHeaders, newBody);

  try {
    const response = await fetch(url, {
      method: newMethod,
      headers: newHeaders,
      body: newBody,
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