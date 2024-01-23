import { Block } from "./block.type";

const blockId = "lazyblock/textimage";

interface TextImageSection {
  id: "lazyblock/textimage";
  attrs: {
    title: string;
    description: string;
    text: string;
    image: any;
    buttons: {
      text: string;
      url: string;
      isFilled: boolean;
      isModalForm: boolean;
    }[];
  };
}

export function reducerTextImage(data: Block): TextImageSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    const image = attrs.image ? JSON.parse(decodeURI(attrs.image)) : null;

    return {
      id: blockId,
      attrs: {
        title: attrs.title || "",
        description: attrs.description || "",
        text: attrs.text || "",
        image: image ? { url: image.url, alt: image.alt } : "",
        buttons: attrs.buttons ? JSON.parse(decodeURI(attrs.buttons)) : [],
      },
    };
  }
  return null;
}
