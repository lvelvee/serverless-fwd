import {VercelRequest, VercelResponse} from "@vercel/node";
import {httpRequest} from "./request.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {

    const body = req.body as {
        url: string;
        method: string;
        body: string;
        headers: { [key: string]: string };
    };

    const {url, method, body: newBody, headers: newHeaders} = body;

    console.log(body);

    try {

        const {
            status,
            headers,
            body
        } = await httpRequest({url, method, body: newBody, headers: newHeaders});

        res.status(status)
        headers && Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        })
        res.send(body);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred while processing the request.'});
    }
}