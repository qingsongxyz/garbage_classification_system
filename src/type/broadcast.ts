import { SlateElement } from '@wangeditor/editor'

type ImageElement = SlateElement & {
    src: string
    alt: string
    url: string
    href: string
}

type InsertFnType = (url: string, alt: string, href: string) => void

interface BroadcastForm {
    userId: number,
    title: string,
    content: string
}

export {
    ImageElement,
    InsertFnType,
    BroadcastForm,
}