import Head from "next/head";
import React from "react";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";

import WoocomerceWordpressApi, {
  COURSE_CATEGORY_ID,
} from "../../services/woocommerceApi";
import WordpressApi, {
  Course,
  Filters,
  Menus,
} from "../../services/wordpressApi";
import Events from "../../components/Events";
import SearchEvents from "../../components/SearchEvents";
import useTransformQueryParamsIntoValue from "../../components/SearchEvents/hooks/useTakeQueryParams";
import ComposerBlocks from "../../components/ComposerBlocks";
import Seo from "../../components/Seo/Seo";
import EmptyList from "../../components/SearchEvents/components/EmptyList/EmptyList";
import TopGraphicsSite from "../../components/TopGraphicsSite/TopGraphicsSite";
import { useHeightSection } from "../../hooks/useHeightSection";

export default function Home({
  events,
  filters,
  data,
  menus,
  tags,
}: {
  events: Course[];
  filters: Filters;
  data: any[];
  menus: Menus;
  tags: any;
}) {
  const [value, setValue] = useTransformQueryParamsIntoValue(filters);
  const filteredEvents = events.filter(
    ({ localizations, specialization, technology, eventType, level }) => {
      const isLevel = !value.levels || level?.includes(value.levels?.label);
      const isSpec =
        !value.specializations ||
        specialization?.includes(value.specializations?.label);
      const isLoc =
        !value.localizations ||
        localizations?.find((loc: string) => loc == value.localizations?.label);
      const isTypes = !value.types || value.types.label == eventType;
      const isTechnologies =
        !value.technologies || technology?.includes(value.technologies?.label);

      return isLevel && isSpec && isLoc && isTypes && isTechnologies;
    }
  );

  const heightSection = useHeightSection(filteredEvents);

  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimal-scale=1.0"
        />
        <Seo tags={tags} />
        <title>Kursy</title>
      </Head>
      {heightSection && <TopGraphicsSite heightPage={heightSection} />}
      <Navigation menu={menus.primary} />
      <main>
        <SearchEvents
          filters={filters}
          activeFilters={value}
          setActiveFilters={setValue}
        />
        {filteredEvents.length > 0 ? (
          <Events events={filteredEvents} />
        ) : (
          <EmptyList />
        )}
        <ComposerBlocks data={data} />
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
}

export async function getServerSideProps({}: any) {
  let data: any;
  let filters = {};
  let page: any;
  let menus = {};

  try {
    [data, filters, page, menus] = await Promise.all([
      WoocomerceWordpressApi.getProducts(COURSE_CATEGORY_ID),
      WordpressApi.getFilters(),
      WordpressApi.getPage("kursy"),
      WordpressApi.getMenus(),
    ]);
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  if (data === undefined) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      events: data.filter(({ isB2b }: { isB2b: boolean }) => !isB2b),
      tags: page.tags,
      filters: filters,
      data: page.blocks,
      menus: menus,
    },
  };
}
