import { Block } from "./block.type";

export const blockId = "lazyblock/calltoactionbig";

interface Button {
  text: string;
  url: string;
  isFilled: boolean;
  newWindow?: boolean;
}
interface CallToActionBigSection {
  id: "lazyblock/calltoactionbig";
  attrs: {
    title: string;
    description?: string;
    modalFormButton?: string;
    modalFormButtonType?: string;
    buttonWithFreeValuation?: boolean;
    buttons: Button[];
  };
}

export function reducerCallToActionBig(
  data: Block
): CallToActionBigSection | null {
  const block = data.blockName == blockId && data;
  if (block) {
    const { attrs } = block;
    return {
      id: blockId,
      attrs: {
        title: attrs.title,
        description: attrs.description || '',
        modalFormButton: attrs.modalFormButton || '',
        modalFormButtonType: attrs.modalFormButtonType || 'contact',
        buttonWithFreeValuation: attrs.buttonWithFreeValuation || false,
        buttons: attrs.buttons
          ? JSON.parse(decodeURI(attrs.buttons)).map((button: any) => ({
              text: button.text || "",
              url: button.url || "",
              isFilled: button.isfilled || false,
              newWindow: button.newWindow || false,
            }))
          : [],
      },
    };
  }
  return null;
}
