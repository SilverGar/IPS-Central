
//REGULAR USERS
export interface DbUserTeam360 {
    TeamOwnerID: number,
    PartnerID: number,
    Partner: string,
    Check1?: boolean,
    EvalType: number,
    Approved?: boolean,
    Hours: number,
    Reason?: string
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
    userType: boolean,
    SU_decision: boolean
}
//HUMAN RESOURCES

export interface Complete_Team360 {
    TeamOwnerID?: number,
    TeamOwner?: string,
    PartnerID?: number,
    Partner?: string,
    OwnerCheck?: boolean,
    PartnerCheck?: boolean,
    EvalType?: number,
    EvalTypePartner?:  number,
    Approved?: boolean,
    Hours: number,
    warning?: number,
    HrDecision?: boolean,
    Reason?: string,
    Notification?: Array<dbConflictData>
}

export interface getConflictData{
    owner: number,
    partner: number,
    evalTypeOwner: number,
    evalTypePartner: number
}

export interface dbConflictData{
  OwnerName: string, 
  OwnerID: number,
  PartnerID: number,
  EvalType: number,
  Reason: string,
  DateCreated?: string,
  HrResponse: string,
  requestType: number
}