
//REGULAR USERS
export interface DbUserTeam360 {
    TeamOwnerID: number,
    TeamOwner: string,
    PartnerID: number,
    Partner: string,
    Check1?: boolean,
    Check2?: boolean,
    Hours: number,
    EvalType: number,
    Approved?: boolean,
    reason?: string
}

export interface UserType{
    Type: number
}

//HUMAN RESOURCES
