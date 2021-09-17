import { Call, Client, CurrentIdentity, CurrentToken, ExprArg, Get } from "faunadb"
import { useMutation, useQuery } from "react-query"
import safeAwait from "../../safeAwait"
import { queryClient, useCurrentHouse } from "../App"
import { Message } from "../types"
import { useToken } from "./Tokens"
import { uuid } from "../logics/uuid"

export const useMessages = (houseRef: number | string) => {
  // We need a token to query the messages
  const { data } = useToken()
  const secret = data?.access.secret

  return useQuery<Message[], Error>(
    ['messages', houseRef],
    async () => {
      const client = secret && new Client({ secret })
      if (!client) throw new Error("FaunaDB Client was not created!")

      const [error, data] = await safeAwait(
        client.query(
          Call("GetHouseMessages", houseRef)
        )
      )

      if (error) {
        console.log(error)
        throw new Error(error.description)
      }
      console.log(data)
      return data.data // FaunaDB returns an object width data here
    },
    {
      // The query will not execute until the secret exists
      enabled: !!secret,
    }
  )
}

export const useCreateMessage = (houseRef: number | string) => {
  // We need a token to query the messages
  const { data } = useToken()
  const secret = data?.access.secret
  const v4 = uuid;
  const { house } = useCurrentHouse()
  return useMutation(
    async (values: ExprArg[]) => {
      const client = secret && new Client({ secret })
      if (!client) throw new Error("FaunaDB Client was not created!")

      const [error, data] = await safeAwait(
        client.query(
          Call("CreateMessage", values)
        )
      )

      if (error) throw new Error(error)
      console.log(data)
      return data
    },
    {
      onMutate: (messageParams: any[]) => {
        const oldMessages = queryClient.getQueryData(['messages', houseRef]);
        if (oldMessages) {
          queryClient.setQueryData(['messages', houseRef], (old: any) => {
            // Creating the fake message is going to be a little complicated
            const newMessage: Message = {
              ref: {
                value: {
                  id: v4(),
                }
              },
              ts: new Date(Date.now()),
              data: {
                student: {
                  ref: {
                    value: {
                      id: "jfkdla;fjkdal;fkds",
                    }
                  },
                  ts: new Date(Date.now()),
                  data: {
                    name: "Nickle Grafitti",
                    prefict: true,
                    house: {
                      data: {
                        name: "Gryffindor",
                      }
                    }
                  }
                },
                house,
                public: false,
                edited: false,
                reactions: [],
                createdAt: new Date(Date.now()),
                message: messageParams[0],
              }
            }
            console.log(old, messageParams)
            return [...old, newMessage]
          });
        }

        return () => queryClient.setQueryData(['messages', houseRef], oldMessages);
      },
      onError: (error, _newMessage, rollback: any) => rollback && rollback(),
      onSettled: () => {
        // queryClient.invalidateQueries(['messages', houseRef])
      }
    }
  )
}

export const useCreateMessageFromStream = (houseRef: number | string) => {
  // We need a token to query the messages
  const { data } = useToken()
  const secret = data?.access.secret
  const v4 = uuid;
  const { house } = useCurrentHouse()
  return useMutation(
    (signalData: any) => signalData,
    {
      onMutate: (signalData: any) => {
        const oldMessages = queryClient.getQueryData(['messages', houseRef]);
        if (oldMessages) {
          queryClient.setQueryData(['messages', houseRef], (old: any) => {
            // Creating the fake message is going to be a little complicated
            const newMessage: Message = {
              ref: {
                value: {
                  id: v4(),
                }
              },
              ts: new Date(Date.now()),
              data: {
                student: {
                  ref: {
                    value: {
                      id: "jfkdla;fjkdal;fkds",
                    }
                  },
                  ts: new Date(Date.now()),
                  data: {
                    name: "Nickle Grafitti",
                    prefict: true,
                    house: {
                      data: {
                        name: "Gryffindor",
                      }
                    }
                  }
                },
                house,
                public: false,
                edited: false,
                reactions: [],
                createdAt: new Date(Date.now()),
                message: signalData.data.history.data,
              }
            }
            console.log(signalData.data.history.data)
            return [...old, {
              data: signalData.data.history.data,
              ref: {
                value: {
                  id: v4(),
                }
              }
            }]
          });
        }

        return () => queryClient.setQueryData(['messages', houseRef], oldMessages);
      },
      onError: (error, _newMessage, rollback: any) => rollback && rollback(),
      onSettled: () => {
        // queryClient.invalidateQueries(['messages', houseRef])
      }
    }
  )
}