import { Icon } from "@iconify/react"
import React, { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useRef, useState } from "react"
import { useCreateMessageFromStream, useMessages } from "../queries/Messages"
import { Message as MessageType } from "../types"
import { time } from "../logics/simpleTime"
import { houseColor } from "../logics/houseColors"
import { useCurrentHouse } from "../App"
import { CommonRoomHeader } from "./CommonRoomHeader"
import { Message } from "./Message"
import faunadb, { Collection, Expr, Ref } from "faunadb"
import { useToken } from "../queries/Tokens"
import { NewMessage } from "./NewMessage"
import FaunaStream from "../queries/FaunaStream"
import { Loader } from "./Loader"

type Props = { }

export const MessageBoard: FC<Props> = () => {
  // The current house, accsessed with the useCurrentHouse hook
  const { house, houseStream } = useCurrentHouse()

  // The messages returned for a particular house
  const { isLoading, isError, error, isSuccess, data: messages } = useMessages(house?.ref?.value.id)
  const messagesEndRef = useRef<any>(null)

  const scrollToBottom = () => {
    // This "smooth" behavior is not working on Safari
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const newMessage = useCreateMessageFromStream(house?.ref?.value.id)

  useEffect(() => {
    if (houseStream)
      houseStream.onUpdate.add((signal: any) => {
        if (signal.event === "new message") {
          console.log(signal)
          newMessage.mutate(signal.data)
        }
      })
  }, [houseStream])

  useEffect(() => {
    scrollToBottom()
  }, [messages]); 

  return (
    <div className="w-6/12 flex flex-col h-full">
      <CommonRoomHeader houseName={house?.data?.name} />
        {(isError && error) && 
        <div className="flex-grow w-full px-4 flex items-center justify-center h-full">
          <pre className="bg-blueGray-800 text-rose-400 w-full overflow-scroll rounded-lg p-4 h-56">
            <pre className="text-blueGray-500">
              // Maybe we don't want to actually show the error message <br/>
              // but instead show a "Login to see this commoon room", or <br/>
              // "You must be in Gryffindor to see this common room". <br/>
              // This is here though, to prove that you cannot access these messages <br/>
            </pre>
            Error: {error.message}
          </pre>
        </div>
        }
        {
          isLoading && 
          <div className="flex-grow w-full flex items-center justify-center h-full">
            <Loader />
          </div>
        }
        {
          (isSuccess && messages) && <div 
          className="overflow-scroll flex-grow px-4 space-y-4">
            {messages.map((message: MessageType) => 
              <Message message={message} key={message.ref.value.id} />
            )}
            <div ref={messagesEndRef} />
          </div>
        }
      <NewMessage />
    </div>
  )
}