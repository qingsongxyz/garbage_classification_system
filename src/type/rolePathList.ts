import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"
import Role from "./roleList"

interface RolePath {
    id: number,
    roleId?: number,
    role: string,
    name: string,
    pathId?: number,
    path?: string,
    description?: string 
}

interface SpanMethodProps {
    row: Role
    column: TableColumnCtx<Role>
    rowIndex: number
    columnIndex: number
}

interface RolePathForm {
    pathId?: number,
    path: string,
    roleId?: number,
    role: string
}

export {
    RolePath,
    SpanMethodProps,
    RolePathForm
};
