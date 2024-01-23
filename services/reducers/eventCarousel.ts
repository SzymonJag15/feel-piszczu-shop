import wordpressApi, { Course } from "../wordpressApi";
import { Block } from "./block.type";

const blockId = "lazyblock/events";

interface EventSection {
  id: "lazyblock/events";
  attrs: {
    events: Course[];
  };
}

export async function reducerEvents(data: Block): Promise<EventSection | null> {
  const block = data.blockName == blockId && data;
  
  if (block) {
    const eventsList = JSON.parse(decodeURI(block.attrs.list)).map(
      ({ event }: any) => event
    );

    let events = await wordpressApi.getCourses(eventsList);
    events = eventsList.map((el: number) => events.find(({ id }) => el == id)).filter((el: any) => el !== undefined);

    return {
      id: blockId,
      attrs: {
        events
      },
    };
  }
  return null;
}
