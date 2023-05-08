import User from "./userList"

interface Broadcast {
    id: number,
    userId: number,
    title: string,
    content: string,
    createTime: string,
    userVO?: User
}

interface UpdateBroadcastForm {
    id: number,
    title: string,
    content: string,
}

export {
    Broadcast,
    UpdateBroadcastForm,
}