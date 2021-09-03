import { Icon } from "@iconify/react"
import React, { FC, useState } from "react"
import { House } from "./Houses"
import { Student } from "./UserCard"

export type Message = {
  ref: {
    value: {
      id: string
    }
  }
  data: {
    student: Student,
    house: House,
    message: string,
  }
}

type Props = { }

export const MessageBoard: FC<Props> = () => {
  const [messages, setMessages] = useState<Message[] | null>(null)

  return (
    <div className="col-span-6 p-4">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-scroll">
          <div className="text-xl font-bold flex items-center space-x-4 pb-8 pt-4">
            <Icon icon="emojione:lion-face" className="text-3xl" />
            <p>Gryffidor Common Room</p>
          </div>
          { messages.map((message: Message) => 
            <div key={message.ref.value.id} className="flex space-x-4">
              <div className="w-8 h-8 bg-red-600 flex-shrink-0 text-red-100 rounded-full flex items-center justify-center text-xs font-semibold">
                HP
              </div>
              <div className="space-y-6 flex-grow">
                <div className="w-full flex justify-between items-center">
                  <div className="flex space-x-4 items-start">
                    <p className="font-semibold text-sm">Harry Potter</p>
                    <div className="px-2 py-1 text-[10px] bg-blueGray-300 text-blueGray-500 font-bold rounded-md">PUBLIC</div>
                    <div className="px-2 py-1 text-[10px] bg-red-300 text-red-800 font-bold rounded-md">Gryffindor</div>
                  </div>
                  <p className="text-blueGray-600 text-xs">14:24 pm (edited)</p>
                </div>
                <p>
                  { message.data.message }            
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex py-4 items-center">
          <input className="focus:outline-none foucs:border-blueGray-800 flex-grow apperance-none px-5 py-2 border-2 border-blueGray-300 rounded-md" placeholder="Winguardian Leviosa..." />
          <div className="px-4 py-2 bg-blue-600 text-blue-100 font-bold mx-4 rounded-md border-2 border-blue-600">Post</div>
        </div>
      </div>
    </div>
  )
}