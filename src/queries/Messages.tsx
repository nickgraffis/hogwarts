import { Call, Client } from "faunadb"
import { useQuery } from "react-query"
import safeAwait from "../../safeAwait"
import { Message } from "../types"
import { useToken } from "./Tokens"

export const useMessages = (houseRef: number) => {
  // We need a token to query the messages
  const { data } = useToken()
  const secret = data?.access.secret

  return useQuery<Message[], Error>(
    ['messages', houseRef],
    async () => {
      const client = secret && new Client({ secret})
      if (!client) throw new Error("FaunaDB Client was not created!")

      const [error, data] = await safeAwait(
        client.query(
          Call("GetMessagesByHouseRef", houseRef)
        )
      )
      if (error) throw new Error(error)
      
      return data.data
    },
    {
      // The query will not execute until the secret exists
      enabled: !!secret,
    }
  )
}