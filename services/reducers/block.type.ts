export interface Block {
  blockName: string;
  attrs: {
    [key: string]: any;
  };
  innerBlocks: { blockName: string }[];
  innerHTML: string;
}

export interface ImageProps {
  url: string;
  alt?: string;
}