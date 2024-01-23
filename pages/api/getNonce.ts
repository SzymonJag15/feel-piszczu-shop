import { NextApiRequest, NextApiResponse } from "next";
import WoocomerceWordpressApi from "../../services/woocommerceApi";
import { getCookie, setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data;
  data = getCookie("nonce", { req, res });

  if (!data || req.query.refresh) {
    data = await WoocomerceWordpressApi.getNonce();
    setCookie("nonce", data, {
      req,
      res,
      maxAge: 43200,
    });
  }

  if (req.method === "GET") {
    res.status(200).json({ nonce: data });
  }
}
