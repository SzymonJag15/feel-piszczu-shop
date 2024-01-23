import { Block } from "./block.type";

const blockId = "lazyblock/trainers";

interface TrainersSection {
  id: "lazyblock/trainers";
  attrs: {
    title: string;
    text: string;
    description: string;
    type: string;
  };
}

export function reducerTrainers(data: Block): TrainersSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;

    return {
      id: blockId,
      attrs: {
        title: attrs.title || "",
        text: attrs.text || "",
        description: attrs.post_content || "",
        type: attrs.type || "",
      },
    };
  }
  return null;
}
