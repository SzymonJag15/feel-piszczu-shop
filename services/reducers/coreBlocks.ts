import { Block } from "./block.type";

const blocksId = ["core/heading", "core/paragraph", "core/separator"];

interface FactCourseSection {
  id: string;
  attrs: {
    html: string;
  };
}

export function reducerCoreBlocks(data: Block): FactCourseSection | null {
  const block = blocksId.indexOf(data.blockName) >= 0 && data;
  if (block) {
    const { innerHTML } = block;
    return {
      id: data.blockName,
      attrs: {
        html: innerHTML,
      },
    };
  }
  return null;
}
