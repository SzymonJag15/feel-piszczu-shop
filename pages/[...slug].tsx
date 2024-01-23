import Head from "next/head";
import React from "react";

import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

import WordpressApi, { Menus } from "../services/wordpressApi";
import ComposerBlocks from "../components/ComposerBlocks";
import Seo from "../components/Seo/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { IBreadcrumb } from "../services/breadcrumbReducer";
import { Container, Row, Col } from "react-bootstrap";
import TopGraphicsSite from "../components/TopGraphicsSite/TopGraphicsSite";
import { useHeightSection } from "../hooks/useHeightSection";

export default function Composer({
  data,
  menus,
  tags,
  breadcrumbs,
}: {
  data: any;
  menus: Menus;
  tags: any;
  breadcrumbs: IBreadcrumb[];
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
        <Container>
          <Row>
            <Col xs={12}>
              {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
            </Col>
          </Row>
        </Container>
        <ComposerBlocks data={data} />
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
}

export async function getServerSideProps({ params: { slug } }: any) {
  let data: any;
  let menus = {};

  try {
    [data, menus] = await Promise.all([
      WordpressApi.getPage(slug[slug.length - 1]),
      WordpressApi.getMenus(),
    ]);
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  if (data.blocks === undefined) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data: data.blocks,
      tags: data.tags,
      breadcrumbs: data.breadcrumbs,
      menus,
    },
  };
}
