import { ExprVal } from "faunadb/src/types/query"

export type Ref = {
  value: {
    id: string
  }
}

export type Token = {
  ref: ExprVal, // The ref to this specific token
  ts: Date, // The time the token was created
  instance: ExprVal // The role that the token is for
  ttl: {
    '@ts': Date // The time at which the token expires
  },
  secret: string // The token
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
  ref: Ref,
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
    house: House,
    prefict: boolean,
  }
}

export type Message = {
  ref: Ref,
  ts: Date,
  data: {
    student: Student,
    message: string
    public: boolean,
    house: House,
    edited: boolean,
    reactions: { [key: string]: string }[],
    createdAt: Date,
  }
}