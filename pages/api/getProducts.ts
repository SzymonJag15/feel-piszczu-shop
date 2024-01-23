import { NextApiRequest, NextApiResponse } from "next";
import WoocomerceWordpressApi from "../../services/woocommerceApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const products = await WoocomerceWordpressApi.getProducts();

  if (req.method === "GET") {
    res.status(200).json({ products });
  }
}
