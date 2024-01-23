import wordpressApi from "../wordpressApi";
import { Block } from "./block.type";

const blockId = "lazyblock/people";

interface TrainersSection {
  id: "lazyblock/people";
  attrs: {
    title: string;
    text: string;
    people: any[];
  };
}

export async function reducerPeople(data: Block): Promise<TrainersSection | null> {
  const block = data.blockName == blockId && data;

  if (block) {
    const { attrs } = block;

    const peoples = attrs.people ? JSON.parse(decodeURI(attrs.people)).map(
      ({ single }: any) => single
    ) : [];
    let peoplesFromWordpress = await wordpressApi.getTrainers(peoples);
    
    if(peoples.length > 0 ){
      peoplesFromWordpress = peoples.map((el: number) => peoplesFromWordpress.find(({ id }) => el == id));
    }
    return {
      id: blockId,
      attrs: {
        title: attrs.title || "",
        text: attrs.text || "",
        people: peoplesFromWordpress,
      },
    };
  }
  return null;
}
