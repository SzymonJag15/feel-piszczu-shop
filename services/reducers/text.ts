import { Block } from "./block.type";

const blockId = "lazyblock/text";
interface Button {
  text: string;
  url: string;
  isFilled: boolean;
}
interface TextSection {
  id: "lazyblock/text";
  attrs: {
    title: string;
    description: string;
    text: string;
    buttons: Button[];
  };
}

export function reducerText(data: Block): TextSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title || "",
        description: attrs.description || "",
        text: attrs.text || "",
        buttons: attrs.buttons
          ? JSON.parse(decodeURI(attrs.buttons)).map((button: any) => ({
              text: button.text || "",
              url: button.url || "",
              isFilled: button.isfilled || false,
            }))
          : [],
      },
    };
  }
  return null;
}
