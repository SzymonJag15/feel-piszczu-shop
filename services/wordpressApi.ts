import { reducerEvents } from "./reducers/eventCarousel";
import { reducerHeroSectionHP } from "./reducers/heroSectionHp";
import { reducerInfographic } from "./reducers/infographic";
import { reducerCallToAction } from "./reducers/callToAction";
import { reducerOpinions } from "./reducers/opinons";
import { reducerPartners } from "./reducers/partners";
import { reducerTextImage } from "./reducers/textImage";
import { reducerBossComment } from "./reducers/bossComment";
import { reducerFactNumbers } from "./reducers/factNumbers";
import { reducerCallToActionBig } from "./reducers/callToActionBig";
import { reducerInfographicBusiness } from "./reducers/infographicBusiness";
import { reducerWhatWeCanDo } from "./reducers/whatWeCanDo";
import { reducerOfferForBusiness } from "./reducers/offerForBusiness";
import { reducerCourseSidebar } from "./reducers/courseSidebar";
import { reducerText } from "./reducers/text";
import { reducerList } from "./reducers/list";
import { reducerFactCourse } from "./reducers/factCourse";
import { reducerCoreBlocks } from "./reducers/coreBlocks";
import { reducerButton } from "./reducers/button";
import { reducerTrainers } from "./reducers/trainers";
import { reducerMenuSidebar } from "./reducers/menuSidebar";
import { reducerCollapse } from "./reducers/collapse";
import { reducerFilesToDownload } from "./reducers/filesToDownload";
import { reducerTextImages } from "./reducers/textImages";
import { reducerPeople } from "./reducers/people";
import { reducerBlogPostHero } from "./reducers/blogPostHero";
import { reducerBreadcrumb } from "./breadcrumbReducer";
import { reducerWhatNext } from "./reducers/whatNext";
import { reducerFreeValuation } from "./reducers/freeValuation";
import { reducerSinglePeoples } from "./reducers/singlePeoples";
import { reducerAllEvents } from "./reducers/allEventsCarousel";

import cache from "memory-cache";

export const API_URL = "https://shop.codeme.pl/wp-json/wp/v2";
export const DOMAIN_URL = "https://shop.codeme.pl/";

let headers = new Headers();

headers.set(
  "Authorization",
  "Basic " +
    Buffer.from("postPreview:DyvZ lqeB IkQ5 p2AA RynJ eDk6").toString("base64")
);

export interface Course {
  id?: number;
  slug: string;
  title: string;
  eventType?: string;
  specialization?: string[];
  level?: string;
  localizations?: string[];
  technology?: string;
  imageHeader: string;
}

interface CourseDetailed extends Course {
  blocks: any[];
  tags: any;
}

interface Trainer {
  id: number;
  name: string;
  image: string;
  title: string;
  linkedinUrl?: string;
  slug?: string;
  description: string;
}
export interface Filter {
  slug: string;
  name: string;
}
export interface Filters {
  specializations: Filter[];
  levels: Filter[];
  localizations: Filter[];
  types: Filter[];
  technologies: Filter[];
}

export interface MenuItem {
  url: string;
  children: MenuItem[];
  title: string;
}

export interface Menus {
  primary: MenuItem[];
  footer1: MenuItem[];
  footer2: MenuItem[];
}
class WordpressAPI {
  constructor() {}

  async getPage(slug: string) {
    return await cacheIt("page2" + slug, async () => {
      const data = await fetch(`${API_URL}/pages?slug=${slug}`).then(
        (respond) => respond.json()
      );
      if (!data.length) {
        return [];
      }
      const breadcrumbs = reducerBreadcrumb(data[0].head_tags);
      const tmp = await WordpressAPI.reducers(data[0].blocks);
      return {
        blocks: tmp,
        tags: data[0].head_tags,
        breadcrumbs: breadcrumbs,
      };
    });
  }
  async getPreviewPage(slug: string) {
    const data = await fetch(`${API_URL}/pages?id=${slug}&status=draft`, {
      headers,
    }).then((respond) => respond.json());
    if (!data.length) {
      return [];
    }
    const breadcrumbs = reducerBreadcrumb(data[0].head_tags);
    const tmp = await WordpressAPI.reducers(data[0].blocks);
    return { blocks: tmp, tags: data[0].head_tags, breadcrumbs: breadcrumbs };
  }

  async getBlogPost(slug: string) {
    const data = await fetch(`${API_URL}/posts?slug=${slug}&_embed`).then(
      (respond) => respond.json()
    );
    if (!data.length) {
      return [];
    }
    const blocks = await WordpressAPI.reducers(data[0].blocks);
    const element = data[0];
    const author = element._embedded.author;

    const tmp = {
      slug: element.slug,
      title: element.title.rendered,
      excerpt: element.excerpt.rendered,
      date: element.date,
      blocks,
      tags: data[0].head_tags,
      image: element.featured_media
        ? { url: element.featured_image_src }
        : false,
      author: {
        name: author[0].name,
      },
    };

    return tmp;
  }
  async getPreviewBlogPost(slug: string) {
    const data = await fetch(
      `${API_URL}/posts?id=${slug}&_embed&status=draft`,
      {
        headers,
      }
    ).then((respond) => respond.json());
    if (!data.length) {
      return [];
    }
    const blocks = await WordpressAPI.reducers(data[0].blocks);
    const element = data[0];
    const author = element._embedded.author;

    const tmp = {
      slug: element.slug,
      title: element.title.rendered,
      excerpt: element.excerpt.rendered,
      date: element.date,
      blocks,
      tags: data[0].head_tags,
      image: element.featured_media
        ? { url: element.featured_image_src }
        : false,
      author: {
        name: author[0].name,
      },
    };

    return tmp;
  }
  async getBlogPosts(page = 1) {
    const data = await fetch(`${API_URL}/posts?page=${page}&_embed`).then(
      (respond) => respond.json()
    );

    if (!data.length) {
      return [];
    }

    const tmp = data.map((element: any) => ({
      slug: element.slug,
      title: element.title.rendered,
      excerpt: element.excerpt.rendered,
      image: element.featured_media
        ? { url: element.featured_image_src }
        : false,
      date: element.date,
      author: {
        name: element._embedded.author[0].name,
      },
    }));

    return tmp;
  }

  async getCoursePage(slug: string): Promise<CourseDetailed> {
    return await cacheIt("course" + slug, async () => {
      const data = await fetch(`${API_URL}/kurs?slug=${slug}&_embed`).then(
        (respond) => respond.json()
      );
      const tmp = await WordpressAPI.reducers(data[0].blocks);
      return {
        ...WordpressAPI.reducerCourse(data[0]),
        tags: data[0].head_tags,
        blocks: tmp,
      };
    });
  }

  async getCourses(ids: number[] = []): Promise<Course[]> {
    console.log(
      `${API_URL}/kurs?${ids
        .map((id) => `include[]=${id}`)
        .join("&")}&_embed&per_page=50`
    );
    const tmp = await cacheIt("kursy4" + ids.join(","), async () => {
      const data = await fetch(
        `${API_URL}/kurs?${ids
          .map((id) => `include[]=${id}`)
          .join("&")}&_embed&per_page=50`
      ).then((respond) => respond.json());

      const coures = await data
        .map((element: any) => {
          try {
            return WordpressAPI.reducerCourse(element);
          } catch (error) {
            console.log(error);
            return null;
          }
        })
        .filter((el: any) => el)
        .filter((el: any) => !el.ended);

      return coures;
    });
    return tmp;
  }

  async getPagesMenu(
    ids: number[]
  ): Promise<{ id: number; title: string; slug: string }[]> {
    const reduce = (respond: any[]) =>
      respond.map(({ id, title, slug }) => ({
        id,
        title: title.rendered,
        slug,
      }));

    return await fetch(
      `${API_URL}/pages?${ids.map((id) => `include[]=${id}`).join("&")}`
    )
      .then((respond) => respond.json())
      .then(reduce);
  }

  async getTrainers(ids: number[]): Promise<Trainer[]> {
    const reduce = (respond: any[]) => {
      return respond.map(({ id, title, ...rest }) => ({
        id,
        name: title.rendered,
        title: rest["job-title"],
        image: rest["zdjecie"].guid || "",
        description: rest.content.rendered,
        linkedinUrl: rest["linkedin-url"] || null,
      }));
    };
    return cacheIt(
      "trainers" + ids.join(","),
      async () =>
        await fetch(
          `${API_URL}/trener?per_page=100&${ids
            .map((id) => `include[]=${id}`)
            .join("&")}`
        )
          .then((respond) => respond.json())
          .then(reduce)
    );
  }

  async getFilesCategory(): Promise<
    {
      id: number;
      name: string;
    }[]
  > {
    const reduce = (respond: any[]) =>
      respond.map(({ id, name }) => ({
        id,
        name,
      }));

    return await fetch(`${API_URL}/kategorie_plikw`)
      .then((respond) => respond.json())
      .then(reduce);
  }

  async getFilters(): Promise<Filters> {
    const reduce = (respond: any[]) =>
      respond.map(({ slug, name }) => ({
        slug,
        name,
      }));
    const data = await cacheIt("filters3", async () => {
      const specializations = await fetch(`${API_URL}/specjalizacja`)
        .then((respond) => respond.json())
        .then(reduce);

      const levels = await fetch(`${API_URL}/poziom_zaawansowania`)
        .then((respond) => respond.json())
        .then(reduce);

      const localizations = await fetch(`${API_URL}/lokalizacja`)
        .then((respond) => respond.json())
        .then(reduce);

      const types = await fetch(`${API_URL}/typ_wydarzenia`)
        .then((respond) => respond.json())
        .then(reduce);

      const technologies = await fetch(`${API_URL}/technologie`)
        .then((respond) => respond.json())
        .then(reduce);
      const promisesAll = await Promise.all([
        specializations,
        levels,
        localizations,
        types,
        technologies,
      ]);

      return {
        specializations: promisesAll[0],
        levels: promisesAll[1],
        localizations: promisesAll[2],
        types: promisesAll[3],
        technologies: promisesAll[4],
      };
    });

    return data;
  }

  async getMenus(): Promise<Menus> {
    console.time("menu4");
    const data = await cacheIt("menu5", async () => {
      const menu = await fetch(`${API_URL}/menu`).then((respond) =>
        respond.json()
      );
      return menu;
    });
    let menus: Menus = {
      primary: [],
      footer1: [],
      footer2: [],
    };
    try {
      menus = {
        primary: WordpressAPI.reducerMenu(data.primary),
        footer1: WordpressAPI.reducerMenu(data.footer1),
        footer2: WordpressAPI.reducerMenu(data.footer2),
      };
    } catch (error) {
      console.log(error);
    }
    console.timeEnd("menu4");
    return menus;
  }

  static reducerMenu(
    menu: { ID: number; title: string; url: string; menu_item_parent: number }[]
  ): MenuItem[] {
    const helperReference: MenuItem[] = [];
    menu.forEach((element) => {
      helperReference[element.ID] = {
        title: element.title,
        url: element.url,
        children: [],
      };
    });

    menu.forEach((element) => {
      helperReference[element.menu_item_parent]?.children.push(
        helperReference[element.ID]
      );
    });

    const newMenu = menu
      .map((element) => {
        if (element.menu_item_parent != 0) {
          return null;
        }
        return helperReference[element.ID];
      })
      .filter((el) => el);

    return newMenu as MenuItem[];
  }

  static reducerCourse(course: any): Course {
    return {
      id: course.id,
      slug: course.slug,
      title: course.title.rendered,
      imageHeader: course?.image_header?.guid || null,
    };
  }

  static reducerTrainer(trainer: any): Trainer {
    return {
      id: 0,
      name: trainer.post_title || null,
      title: trainer["job-title"] || null,
      linkedinUrl: trainer["linkedin-url"] || null,
      image: trainer.zdjecie.guid || trainer.zdjecie || null,
      slug: trainer.post_name || null,
      description: trainer.post_content || null,
    };
  }

  static async reducers(data: any) {
    const reducers = [
      reducerHeroSectionHP,
      reducerEvents,
      reducerInfographic,
      reducerCallToAction,
      reducerOpinions,
      reducerPartners,
      reducerTextImage,
      reducerTextImages,
      reducerText,
      reducerBossComment,
      reducerFactNumbers,
      reducerCallToActionBig,
      reducerInfographicBusiness,
      reducerWhatWeCanDo,
      reducerOfferForBusiness,
      reducerCourseSidebar,
      reducerList,
      reducerFactCourse,
      reducerCoreBlocks,
      reducerButton,
      reducerTrainers,
      reducerMenuSidebar,
      reducerCollapse,
      reducerFilesToDownload,
      reducerPeople,
      reducerBlogPostHero,
      reducerWhatNext,
      reducerFreeValuation,
      reducerSinglePeoples,
      reducerAllEvents,
    ];

    const promised = await Promise.all(
      data.map(async (singleBlock: any) => {
        return Promise.all(
          reducers.map(async (reducer) => await reducer(singleBlock))
        ).then((element) => element.filter((data) => data)[0]);
      })
    );

    return promised.filter((data: any) => data);
  }
}

export default new WordpressAPI();
export { WordpressAPI };

export async function cacheIt(key: string, func: () => Promise<any>) {
  let data = cache.get(key);

  if (!data) {
    data = await func();
    console.log("notHit", key);
    cache.put(key, data, 1000 * 60 * 15);
  } else {
    // console.log(key,);
    console.log("hit", key);
  }

  return data;
}
