import { Block } from "./block.type";

const blockId = "lazyblock/free-valuation";

interface IFreeValuation {
  id: "lazyblock/free-valuation";
  attrs: {
    language: 'pl' | 'en';
  };
}

export function reducerFreeValuation(data: Block): IFreeValuation | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;

    return {
      id: blockId,
      attrs: {
        language: attrs.language || 'pl'
      },
    };
  }
  return null;
}
