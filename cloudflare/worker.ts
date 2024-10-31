interface Env { }

export default {
  async fetch(req: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    return new Response("", { status: 500 });

  },
};
