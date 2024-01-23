import { elements } from "./../../components/WhatWeCanDoForYou/WhatWeCanDoForYou.const";
import { Block } from "./block.type";

const blockId = "lazyblock/offerforbusiness";

interface OfferForBusinessSection {
  id: "lazyblock/offerforbusiness";
  attrs: {
    title: string;
    description: string;
    isFullWidth: boolean;
    elements: {
      image: string;
      title: string;
      description: string;
      href: string;
    }[];
  };
}

export function reducerOfferForBusiness(
  data: Block
): OfferForBusinessSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.text || "",
        description: attrs.description || "",
        isFullWidth: attrs.isfullwidth || false,
        elements: JSON.parse(decodeURI(attrs.kursy)),
      },
    };
  }
  return null;
}
