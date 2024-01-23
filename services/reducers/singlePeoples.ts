import { Block } from "./block.type";

const blockId = "lazyblock/single-people";

export interface SinglePeople { 
  responsibleForWhat: string;
  name: string;
  title: string;
  image: string;
  linkedinUrl: string;
  phoneNumber: string;
  email: string;
}

interface SinglePeoples {
  id: "lazyblock/single-people";
  attrs: {
    titleSection: string;
    peoples: SinglePeople;
  };
}

export function reducerSinglePeoples(data: Block): SinglePeoples | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        titleSection: attrs.titleSection || "",
        peoples: attrs.peoples
          ? JSON.parse(decodeURI(attrs.peoples)).map((people: any) => ({
              responsibleForWhat: people.responsibleForWhat || "",
              name: people.name || "",
              title: people.title || "",
              image: people.image ? people.image?.url : "",
              linkedinUrl: people.linkedinUrl || "",
              phoneNumber: people.phoneNumber || "",
              email: people.email || "",
            }))
          : [],
      },
    };
  }
  return null;
}
