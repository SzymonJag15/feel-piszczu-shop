import woocommerceApi, { COURSE_CATEGORY_ID } from "../woocommerceApi";
import { Course } from "../wordpressApi";
import { Block } from "./block.type";

const blockId = "lazyblock/all-courses";

interface EventSection {
  id: "lazyblock/all-courses";
  attrs: {
    events: Course[];
    withEvents?: boolean;
  };
}

export async function reducerAllEvents(data: Block): Promise<EventSection | null> {
  const block = data.blockName == blockId && data;
  
  if (block) {
    const { attrs } = block;
    const allEvents = await woocommerceApi.getProducts(!attrs?.withEvents && COURSE_CATEGORY_ID);

    return {
      id: blockId,
      attrs: {
        events: allEvents
      },
    };
  }
  return null;
}
