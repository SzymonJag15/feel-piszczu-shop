import { NextApiRequest, NextApiResponse } from "next";
import { API_STORE_URL_WC } from "../../services/woocommerceApi";
import { getCookie, setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data;
  data = getCookie('cart-token', { req, res });

  if (!data) {
    const cartResponse = await fetch(`${API_STORE_URL_WC}/cart`, { method: 'GET' });
    data = cartResponse.headers.get('cart-token');

    setCookie('cart-token', data, {
      req,
      res,
      maxAge: 43200,
    });
  };

  if (req.method === "GET") {
    res.status(200).json({ cartToken: data });
  }
}
