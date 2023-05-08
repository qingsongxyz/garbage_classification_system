import Path from "./pathList";

interface Role {
    id: number,
    role: string,
    name: string
    pathList?: Path[]
    rolePathId?: number
}

export default Role;