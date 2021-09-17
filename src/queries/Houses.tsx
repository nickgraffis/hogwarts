import { Client, Get, Index, Lambda, Match, Paginate, Var, Map } from "faunadb"
import { useQuery } from "react-query"
import safeAwait from "../../safeAwait"
import { House, Message } from "../types"
import { useToken } from "./Tokens"

export const useHouses = () => {
  // We need a token to query the messages
  const { data } = useToken()
  const secret = data?.access.secret

  return useQuery<House[], Error>(
    ['houses'],
    async () => {
      const client = secret && new Client({ secret })
      if (!client) throw new Error("FaunaDB Client was not created!")

      const [error, data] = await safeAwait(
        client.query(
          Map(
            Paginate(Match(Index("all_houses"))),
            Lambda(
              "house",
              Get(Var("house"))
            )
          )
        )
      )

      if (error) throw new Error(error)
      console.log(data)
      return data.data // FaunaDB returns an object with data here
    },
    {
      // The query will not execute until the secret exists
      enabled: !!secret,
    }
  )
}