import wordpressApi from "../wordpressApi";
import { Block } from "./block.type";

const blockId = "lazyblock/files-to-download";

interface OfferForBusinessSection {
  id: "lazyblock/files-to-download";
  attrs: {
    categories: {
      name: string;
      id: number;
    }[];
    files: {
      name: string;
      description: string;
      file: string;
      category: string;
    }[];
  };
}

export async function reducerFilesToDownload(
  data: Block
): Promise<OfferForBusinessSection | null> {
  const block = data.blockName == blockId && data;
  const categories = await wordpressApi.getFilesCategory();
  if (block) {
    const { attrs } = block;

    return {
      id: blockId,
      attrs: {
        files: JSON.parse(decodeURI(attrs.files)),
        categories,
      },
    };
  }
  return null;
}
