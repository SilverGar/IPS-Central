
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
    TeamOwner: string,
    PartnerID?: number,
    Partner?: string,
    OwnerCheck?: boolean,
    PartnerCheck?: boolean,
    EvalType?: number,
    Approved?: boolean,
    Hours?: number,
    warning?: boolean,
    Reason?: string
}

export interface getConflictData{
    owner: number,
    partner: number,
    evalTypeOwner: number,
    evalTypePartner: number
}

export interface dbConflictData{
    Partner: number,
    Reason: string,
    DateCreated: string
}