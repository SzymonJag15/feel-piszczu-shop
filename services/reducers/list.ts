import { Block } from "./block.type";

const blockId = "lazyblock/list";

interface ListSection {
  id: "lazyblock/list";
  attrs: {
    title: string;
    list: string[];
    buttons: {
      list: string;
      url: string;
      isFilled: boolean;
    }[];
  };
}

export function reducerList(data: Block): ListSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        list: attrs.buttons ? JSON.parse(decodeURI(attrs.list)) : [],
        buttons: attrs.buttons ? JSON.parse(decodeURI(attrs.buttons)) : [],
      },
    };
  }
  return null;
}
