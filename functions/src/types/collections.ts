export type id = string;
type blockType = 'image' | 'header' | 'list' | 'paragraph' | 'checklist' | 'delimiter'

export interface Body {
    time?: number,
    version: string,
    blocks: Block[]
}

export interface Block {
    type: blockType,
    data?: object,
}

export interface IThread {
    title: string,
    created: number,
    board: string,
    body?: Body
    creator: id,
    commentsCount: number,
}
