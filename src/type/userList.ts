import Role from "./roleList";

interface User {
    id: number,
    username: string,
    age: number,
    gender: string,
    image: string | string[],
    email: string,
    phone: string,
    score: number,
    signature: string
    accountLocked: number,
    roleList: Role[]
}

export default User;