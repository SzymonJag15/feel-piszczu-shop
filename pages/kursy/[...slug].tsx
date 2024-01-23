import Head from "next/head";
import React from "react";

import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

import WordpressApi, { Course, Menus } from "../../services/wordpressApi";
import ComposerBlocks from "../../components/ComposerBlocks";
import Seo from "../../components/Seo/Seo";
import TopGraphicsSite from "../../components/TopGraphicsSite/TopGraphicsSite";
import { useHeightSection } from "../../hooks/useHeightSection";
import WoocomerceWordpressApi from "../../services/woocommerceApi";
import { IReducedProductStoreAPI } from "../../services/woocommerceTypes";
import { deleteCookie, getCookie } from "cookies-next";

interface Composer extends Course {
  blocks: any[];
  menus: Menus;
  tags: any;
  product: IReducedProductStoreAPI;
}
export default function Composer({
  blocks,
  menus,
  tags,
  product,
  ...course
}: Composer) {
  const heightSection = useHeightSection();

  return (
    <div>
      <Head>
        <Seo tags={tags} />
        <title>
          {tags.find(({ tag }: { tag: string }) => tag == "title")?.content}
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimal-scale=1.0"
        />
      </Head>
      {heightSection && <TopGraphicsSite heightPage={heightSection} />}
      <Navigation menu={menus.primary} />
      <main>
        <ComposerBlocks
          data={blocks}
          course={{
            ...course,
            ...product,
          }}
        />
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
}

export async function getServerSideProps({ req, res, params: { slug } }: any) {
  let data;
  let menus = {};
  let product;
  console.time("start-kurs");
  try {
    [menus, data] = await Promise.all([
      WordpressApi.getMenus(),
      WordpressApi.getCoursePage(slug[slug.length - 1]),
    ]);
    console.timeLog("start-kurs");
    const title = getCookie("clicked-product-title", { req, res });
    deleteCookie("clicked-product-title", { req, res });

    [product] = await Promise.all([
      WoocomerceWordpressApi.getProductByID(data.id, title),
    ]);
    console.timeEnd("start-kurs");
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  if (data?.blocks === undefined) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...data,
      menus: menus,
      product,
    },
  };
}
