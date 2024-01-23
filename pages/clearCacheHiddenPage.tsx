import React from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

import WordpressApi, { Menus } from "../services/wordpressApi";
import ComposerBlocks from "../components/ComposerBlocks";
import Seo from "../components/Seo/Seo";
import TopGraphicsSite from "../components/TopGraphicsSite/TopGraphicsSite";
import { useHeightSection } from "../hooks/useHeightSection";
import cache from "memory-cache";

export default function Home({
  data,
  menus,
  tags,
}: {
  data: any;
  menus: Menus;
  tags: any;
}) {
  return <div></div>;
}

export async function getServerSideProps() {
  cache.clear();
  return {
    notFound: true,
  };
}
