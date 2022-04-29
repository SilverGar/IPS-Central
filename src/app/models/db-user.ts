
//REGULAR USERS
export interface DbUserTeam360 {
    ID?: number,
    TeamOwner: string,
    Partner: string,
    Check1?: boolean,
    Check2?: boolean,
    Horas: number,
    TipoEval: number,
    Approved: number,
    reason?: string
}

export interface UserType{
    Tipo: number
}

//HUMAN RESOURCES
