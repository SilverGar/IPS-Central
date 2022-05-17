
//REGULAR USERS
export interface DbUserTeam360 {
    TeamOwnerID?: number,
    PartnerID?: number,
    Partner?: string,
    Check1?: boolean,
    Hours?: number,
    EvalType?: number,
    Approved?: boolean,
    Reason?: string,
}

export interface UserType {
    Type: number
}

export interface User {
    id?: number,
    name?: string,
    email?: string,
    AllowEditing?: boolean
}

export interface ManageUsers {
    id: number,
    name: string,
    email: string,
    userType: boolean
}
//HUMAN RESOURCES

export interface Complete_Team360 {
    TeamOwnerID?: number,
    PartnerID?: string,
    Partner?: string,
    OwnerCheck?: boolean,
    PartnerCheck?: boolean,
    EvalType?: number,
    Approved?: boolean,
    Hours?: number
}