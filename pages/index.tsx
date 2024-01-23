import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

import WordpressApi, { Menus } from "../services/wordpressApi";
import ComposerBlocks from "../components/ComposerBlocks";
import Seo from "../components/Seo/Seo";
import TopGraphicsSite from "../components/TopGraphicsSite/TopGraphicsSite";
import { useHeightSection } from "../hooks/useHeightSection";

export default function Home({
  data,
  menus,
  tags,
  nonce,
}: {
  data: any;
  menus: Menus;
  tags: any;
  nonce: string;
}) {
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
        <ComposerBlocks data={data} />
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
}

export async function getServerSideProps() {
  console.time("homeStart");
  let data: any;
  let menus = {};

  try {
    [data, menus] = await Promise.all([
      WordpressApi.getPage("home-page"),
      WordpressApi.getMenus(),
    ]);
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }

  if (data.blocks === undefined) {
    return {
      notFound: true,
    };
  }
  console.timeEnd("homeStart");
  return {
    props: {
      data: data.blocks,
      tags: data.tags,
      menus,
    },
  };
}
