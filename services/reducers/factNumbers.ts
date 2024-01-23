import { Block } from "./block.type";

const blockId = "lazyblock/factnumbers";

interface FactNumbersSection {
  id: "lazyblock/factnumbers";
  attrs: {
    facts: {
      value: string;
      name: string;
    }[];
  };
}

export function reducerFactNumbers(data: Block): FactNumbersSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        facts: JSON.parse(decodeURI(attrs.facts)),
      },
    };
  }
  return null;
}
