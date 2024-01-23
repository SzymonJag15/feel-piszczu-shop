import { Block } from "./block.type";
import { WordpressAPI } from "../wordpressApi";

const blockId = "lazyblock/course-sidebar";

interface CourseSidebar {
  id: "lazyblock/course-sidebar";
  attrs: {};
}

export async function reducerCourseSidebar(
  data: Block
): Promise<CourseSidebar | null> {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs, innerBlocks } = block;
    const [inners] = innerBlocks;

    return {
      id: blockId,
      attrs: {
        button1: attrs.button1,
        button1url: attrs["button1-url"] || "",
        button2: attrs.button2 || "",
        button2url: attrs["button2-url"] || "",
        b2bDescription: attrs["b2b-description"] || "",
        b2bDescriptionBig: attrs["b2b-description-big"] || "",
        blocks: await WordpressAPI.reducers(inners),
      },
    };
  }
  return null;
}
