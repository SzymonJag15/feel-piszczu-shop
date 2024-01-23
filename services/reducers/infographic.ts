import { Block } from "./block.type";

const blockId = "lazyblock/infographic";

interface InfographicSection {
  id: "lazyblock/infographic";
  attrs: {};
}

export function reducerInfographic(data: Block): InfographicSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        description: attrs.description,
        elements: JSON.parse(decodeURI(attrs.blocks)).map(
          (element: any) => ({
            title: element.title,
            description: element.description,
            image: { url: element?.ikona?.url, alt: element?.ikona?.alt },
          })
        ),
      },
    };
  }
  return null;
}
