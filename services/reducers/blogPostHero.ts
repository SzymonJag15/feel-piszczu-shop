
import { Block } from "./block.type";

const blockId = "lazyblock/blog-hero-section";

interface IBlogPostHeroProps {
  id: "lazyblock/blog-hero-section";
  attrs: {
    title: string;
    date: string;
    image: any;
    author: string;
  };
}

export function reducerBlogPostHero(data: Block): IBlogPostHeroProps | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const attrs = block.attrs;
    const image = JSON.parse(decodeURI(attrs.image)) || null;
    
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        date: attrs.date,
        author: attrs.author,
        image: image ? { url: image.url, alt: image.alt } : '',
      },
    };
  }
  return null;
}
