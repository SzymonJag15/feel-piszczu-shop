import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "../styles/slick.css";
import "../styles/slick-theme.css";
import "./blog.css";

import { useCallback, useEffect } from "react";
import type { AppProps } from "next/app";
import TagManager from "react-gtm-module";
import { useRouter } from "next/router";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // useEffect(() => {
  //   TagManager.initialize({ gtmId: "GTM-58NCBV2" });
  // }, []);

  // useEffect(() => {
  //   import("react-facebook-pixel")
  //     .then((x) => x.default)
  //     .then((ReactPixel) => {
  //       ReactPixel.init("162526164373492");
  //       ReactPixel.pageView();

  //       router.events.on("routeChangeComplete", () => {
  //         ReactPixel.pageView();
  //       });
  //     });
  // }, [router.events]);

  const fetchNonce = useCallback(async () => await fetch("/api/getNonce"), []);
  const fetchCartToken = useCallback(
    async () => await fetch("/api/getCartToken"),
    []
  );

  useEffect(() => {
    fetchNonce();
    fetchCartToken();
  }, [fetchNonce, fetchCartToken]);

  return (
    <>
      <Head>
        {/* <link
          rel="prefetch"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
          integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
          crossOrigin="anonymous"
        /> */}

        {/* <script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/1c92b55af7126358159f3a00/script.js" /> */}
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
export default MyApp;
