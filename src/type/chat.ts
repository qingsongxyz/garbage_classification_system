interface ChatUser {
    id: number,
    username: string,
    image: string | string[],
    newMessageCount: number,
    online: boolean
}

export {
    ChatUser,
}