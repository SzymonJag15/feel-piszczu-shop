import { Block } from "./block.type";

const blockId = "lazyblock/bosscomment";

interface BossCommentSection {
  id: "lazyblock/bosscomment";
  attrs: {
    comment: string;
    image: any;
    bossName: string;
    bossImage: any;
  };
}

export function reducerBossComment(data: Block): BossCommentSection | null {
  const block = data.blockName == blockId && data;

  if (block) {
    const { attrs } = block;
    const image = JSON.parse(decodeURI(attrs.image)) || null;
    const bossImage = JSON.parse(decodeURI(attrs["boss-image"])) || null;

    return {
      id: blockId,
      attrs: {
        comment: attrs.comment,
        bossName: attrs["boss-name"],
        image: image ? { url: image.url, alt: image.alt } : '',
        bossImage: bossImage ? { url: bossImage.url, alt: bossImage.alt } : '',
      },
    };
  }
  return null;
}
