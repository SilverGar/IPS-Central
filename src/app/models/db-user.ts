
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

 
// Una notificacion debe tener:
//     Quien la envia
//     A quien va dirigida
//     Tipo de evaluacion en la relacion de quien la envia y quien la recibe
//     Tipo de peticion en la notificacion
//     Estatus de la notificacion(resuelta o no)
//     Respuesta por parte de recursos humanos
//     Fecha de creacion
//     Fecha en la que fue resuelta 

export interface Notification{
    Sender: string, 
    Addressee: string, 
    EvalType: number, 
    RequestType: number, 
    Status: number,
    userComplaint?: string,
    HRresponse?: string, 
    DataCreated: Date, 
    DataSolved?: Date
}

export interface Day{
    date: Date, 
    Notifications?: Array<Notification> 
}