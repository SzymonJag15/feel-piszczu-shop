import { Block } from "./block.type";
import wordpressApi, { WordpressAPI } from "../wordpressApi";

const blockId = "lazyblock/menu-sidebar";

interface MenuSidebar {
  id: "lazyblock/menu-sidebar";
  attrs: {};
}

export async function reducerMenuSidebar(
  data: Block
): Promise<MenuSidebar | null> {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs, innerBlocks } = block;
    const menus = JSON.parse(decodeURI(attrs.menu)).map(
      ({ page }: any) => page
    );
    let menu = await wordpressApi.getPagesMenu(menus);
    menu = menus.map((el: number) => menu.find(({ id }) => el == id));
    return {
      id: blockId,
      attrs: {
        button1: attrs.button1,
        button1url: attrs["button1-url"] || "",
        button2: attrs.button2 || "",
        button2url: attrs["button2-url"] || "",
        blocks: await WordpressAPI.reducers(innerBlocks),
        menu,
      },
    };
  }
  return null;
}
