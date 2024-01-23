import { Block } from "./block.type";

const blockId = "lazyblock/factcourse";

interface FactCourseSection {
  id: "lazyblock/factcourse";
  attrs: {
    sectionTitle?: string;
    facts: {
      title: string;
      icon?: string;
      value: string;
      name: string;
    }[];
    connector: boolean;
  };
}

export function reducerFactCourse(data: Block): FactCourseSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        sectionTitle: attrs.sectionTitle ? attrs.sectionTitle : null,
        facts: JSON.parse(decodeURI(attrs.facts)),
        connector: !!attrs.connector,
      },
    };
  }
  return null;
}
