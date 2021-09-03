import { ExprVal } from "faunadb/src/types/query"

export type Token = {
  secret: string, // The token
  ts: Date, // The time the token was created
  ref: ExprVal, // The ref to this specific token
  instance: ExprVal // The role that the token is for
  ttl: {
    '@ts': Date // The time at which the token expires
  }
}

export type FaunaDBLoggedInToken = {
  student: Student,
  access: Token,
  refresh: Token
}

export type CurrentInstance = {
  access: Token,
  student: Student | null
}

export type House = {
  ref: ExprVal,
  data: {
    name: string,
    mascot: string,
    founder: string,
    head: string
  }
}

export type Student = {
  ref: ExprVal,
  data: {
    name: string,
    house: House
  }
}

export type Message = {
  ref: ExprVal,
  ts: Date,
  data: {
    student: Student,
    message: string
    public: boolean,
    house: House,
    reactions: { [key: string]: string }[],
  }
}