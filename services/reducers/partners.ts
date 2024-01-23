import { Block } from "./block.type";

const blockId = "lazyblock/partners";

interface PartnersSection {
  id: "lazyblock/partners";
  attrs: {};
}

export function reducerPartners(data: Block): PartnersSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;

    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        logos: attrs.logos ? JSON.parse(decodeURI(attrs.logos)) : [],
      },
    };
  }
  return null;
}
