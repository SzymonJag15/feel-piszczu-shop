import { Block } from "./block.type";

const blockId = "lazyblock/whatwecando";

interface WhatWeCanDoSection {
id: "lazyblock/whatwecando";
  attrs: {};
}

export function reducerWhatWeCanDo(data: Block): WhatWeCanDoSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        description: attrs.description,
        elements: JSON.parse(decodeURI(attrs.blocks)),
      },
    };
  }
  return null;
}
