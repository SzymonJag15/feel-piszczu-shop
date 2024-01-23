import { Block } from "./block.type";

const blockId = "lazyblock/button";

interface ButtonSection {
  id: "lazyblock/button";
  attrs: {
    button: string;
    url: string;
    center?: boolean;
  };
}

export function reducerButton(data: Block): ButtonSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;

    return {
      id: blockId,
      attrs: {
        button: attrs.button || null,
        url: attrs.url || "",
        center: attrs.center || false,
      },
    };
  }
  return null;
}
