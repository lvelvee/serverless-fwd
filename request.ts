export async function httpRequest({
                                      url,
                                      method,
                                      body,
                                      headers,

                                  }: {
    url: string;
    method: string;
    body?: string;
    headers?: { [key: string]: string };
}) {

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body,
        });

        const responseBody = await response.text();

        const responseHeaders: { [key: string]: string } = {};

        for (const [key, value] of response.headers.entries()) {
            if (!key.startsWith("Content-") && !key.startsWith("content-")) {
                responseHeaders[key] = value;
            }
        }

        return {
            status: response.status,
            headers: responseHeaders,
            body: responseBody,
            errorMsg: null
        }
    } catch (e: any) {
        return {
            status: 500,
            errorMsg: e.toString()
        }
    }


}
