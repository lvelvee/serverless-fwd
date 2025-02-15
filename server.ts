import express from 'express';
import bodyParser from 'body-parser';
import {httpRequest} from "./request.js";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/api/forward', async (req, res, next) => {
    const payload = req.body as {
        url: string;
        method: string;
        body: string;
        headers: { [key: string]: string };
    };

    console.log('Received data:', payload);

    try {

        const {status, errorMsg, headers, body} = await httpRequest(payload);
        if (errorMsg) {
            throw new Error(errorMsg);
        }

        if (headers) {
            res.setHeaders(new Map(Object.entries(headers!)));
        }

        res.status(status).send(body);

    } catch (e) {
        next(e);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
