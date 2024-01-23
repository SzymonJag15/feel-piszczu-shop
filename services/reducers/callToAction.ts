import { Block } from "./block.type";

const blockId = "lazyblock/calltoaction";

interface CallToActionSection {
  id: "lazyblock/calltoaction";
  attrs: {};
}

export function reducerCallToAction(data: Block): CallToActionSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.text,
        button: attrs.button,
        url: attrs.url || null,
      },
    };
  }
  return null;
}
