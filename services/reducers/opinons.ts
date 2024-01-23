import { Block } from "./block.type";

const blockId = "lazyblock/opinions";

interface OpinionsSection {
  id: "lazyblock/opinions";
  attrs: {};
}

export function reducerOpinions(data: Block): OpinionsSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        description: attrs.description || "",
        information: attrs.information || "",
        isOnCourse: attrs.isOnCourse || null,
        testimonials: JSON.parse(decodeURI(attrs.testimonials)),
        en: attrs.en ? 'en' : 'pl'
      },
    };
  }
  return null;
}
