import { Block } from "./block.type";

const blockId = "lazyblock/hero-section-hp";

interface HeroSectionHP {
  id: "lazyblock/hero-section-hp";
  attrs: {
    title: string;
    description: string;
    text: string;
    image: any;
    language: 'pl' | 'en';
    button1: string;
    button1Url: string;
    button1IsMobileForm: boolean;
    button1IsFull: boolean;
    button2?: string;
    button2Url?: string;
  };
}

export function reducerHeroSectionHP(data: Block): HeroSectionHP | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const attrs = block.attrs;
    const image = JSON.parse(decodeURI(attrs.image)) || null;

    return {
      id: blockId,
      attrs: {
        title: attrs.title || '',
        description: attrs.description  || '',
        text: attrs.text || '',
        image: image ? { url: image.url, alt: image.alt } : '',
        language: attrs.language || 'pl',
        button1: attrs.button1 || "",
        button1Url: attrs["button1-url"] || "",
        button1IsMobileForm: attrs["button1-isModalForm"] || false,
        button1IsFull: attrs["button1-withBackground"] || false,
        button2: attrs.button2 || "",
        button2Url: attrs["button2-url"] || "",
      },
    };
  }
  return null;
}
