import { Block } from "./block.type";

const blockId = "lazyblock/textimages";

interface TextImageSection {
  id: "lazyblock/textimages";
  attrs: {
    sectionId?: string;
    title: string;
    reverted: boolean,
    description: string;
    text: string;
    images: string;
    blog: boolean;
    buttons: {
      text: string;
      url: string;
      isFilled: boolean;
    }[];
  };
}

export function reducerTextImages(data: Block): TextImageSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    const images = attrs.images ? JSON.parse(decodeURI(attrs.images)) : [];

    return {
      id: blockId,
      attrs: {
        sectionId: attrs.sectionId || "",
        title: attrs.title || "",
        description: attrs.description || "",
        text: attrs.text || "",
        images: images.map((attr:any)=>attr?.url),
        reverted: attrs.reverted || false,
        blog: attrs.blog || false,
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
