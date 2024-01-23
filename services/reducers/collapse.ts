import { Block } from "./block.type";

const blockId = "lazyblock/collapse";

interface TextSection {
  id: "lazyblock/collapse";
  attrs: {
    title: string;
    text: string;
  };
}

export function reducerCollapse(data: Block): TextSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title || "",
        text: attrs.text || "",
      },
    };
  }
  return null;
}
