import wordpressApi, { Course } from "../wordpressApi";
import { elements } from "./../../components/WhatWeCanDoForYou/WhatWeCanDoForYou.const";
import { Block } from "./block.type";

const blockId = "lazyblock/whatnext";

interface WhatNextSection {
  id: "lazyblock/whatnext";
  attrs: {
    title: string;
    upTitleNextCourse: string;
    titleNextCourse: string;
    textNextCourse: string;
    nextCourse: string;
    event: Course;
    alternatingSections: {
      imageAlternatingSection: string;
      upTitleAlternatingSection: string;
      titleAlternatingSection: string;
      textAlternatingSection: string;
      textButtonAlternatingSection: string;
      linkButtonAlternatingSection: string;
    }[];
  };
}

export async function reducerWhatNext(
  data: Block
): Promise<WhatNextSection | null> {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    const event = attrs.nextCourse ? await wordpressApi.getCourses([attrs.nextCourse]) : [];

    return {
      id: blockId,
      attrs: {
        title: attrs.title || "",
        upTitleNextCourse: attrs.upTitleNextCourse || "",
        titleNextCourse: attrs.titleNextCourse || "",
        textNextCourse: attrs.textNextCourse || "",
        nextCourse: attrs.nextCourse || "",
        event: event[0] || [],
        alternatingSections: JSON.parse(decodeURI(attrs.alternatingSections)),
      },
    };
  }
  return null;
}
