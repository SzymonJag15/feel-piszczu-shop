import { Block } from "./block.type";

const blockId = "lazyblock/infographicbusiness";

interface InfographicBusinessSection {
  id: "lazyblock/infographicbusiness";
  attrs: {};
}

export function reducerInfographicBusiness(data: Block): InfographicBusinessSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        description: attrs.description,
        elements: JSON.parse(decodeURI(attrs.blocks)),
        en: attrs.en ? 'en' : 'pl'
      },
    };
  }
  return null;
}
