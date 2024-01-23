import React, { useState, useEffect } from "react";
import Head from "next/head";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

import WordpressApi, { Menus } from "../services/wordpressApi";
import TopGraphicsSite from "../components/TopGraphicsSite/TopGraphicsSite";
import { useHeightSection } from "../hooks/useHeightSection";

import styles from "../styles/404.module.css";
import Link from "next/dist/client/link";
import { urlReplace } from "../services/urlReplace";
import { Container } from "react-bootstrap";

export default function Home({ menus }: { menus: Menus; tags: any }) {
  const [coursesLink, setCoursesLink] = useState("");
  const heightSection = useHeightSection();

  useEffect(() => {
    const coursesLink = menus?.primary?.find(
      (elem: any) => elem.title === "Kursy"
    )?.url;

    if (!coursesLink) return setCoursesLink("");
    setCoursesLink(coursesLink);
  }, []);

  return (
    <div>
      <Head>
        <title>404 - not found</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimal-scale=1.0"
        />
      </Head>
      {heightSection && <TopGraphicsSite heightPage={heightSection} />}
      <Navigation menu={menus.primary} />
      <main>
        <Container>
          <div className={styles.contentWrapper}>
            <h2 className={styles.mainLabel}>404</h2>
            <p className={styles.subLabel}>
              Ups... Nie znaleźliśmy strony, której szukasz. Co mozesz zrobić?
            </p>
            <ul className={styles.possibilitiesList}>
              <li>
                Wrócić na <Link href={urlReplace("/")}>stronę główną</Link>
              </li>
              <li>
                Skoczyć do naszych{" "}
                <Link href={urlReplace(coursesLink ? coursesLink : "#")}>
                  kursów
                </Link>
              </li>
              <li>Napisać nam, czego szukasz :)</li>
            </ul>
            <Link href={urlReplace("/kontakt")} passHref>
              <a className={styles.contactButton}>Napisz do nas!</a>
            </Link>
          </div>
        </Container>
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
}

export async function getStaticProps() {
  let data: any;
  let menus = {};
  try {
    [menus] = await Promise.all([WordpressApi.getMenus()]);
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      menus,
    },
    revalidate: 10,
  };
}
