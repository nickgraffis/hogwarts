import { Ref, Collection } from "faunadb"
import React, { FC, useState } from "react"
import { useCurrentHouse } from "../App"
import { useCreateMessage } from "../queries/Messages"

export const NewMessage: FC<{}> = () => {
  const [message, setMessage] = useState("")
  const { house } = useCurrentHouse()
  const newMessage = useCreateMessage(house?.ref?.value.id)
  const sendMessage = () => {
    newMessage.mutate([
      message, 
      Ref(Collection("students"), "308554027877007938"),
      Ref(Collection("houses"), house?.ref?.value.id)
    ])
    setMessage("")
  }
  return (
    <div className="h-24 px-4 w-full">
      <div className="flex py-4 items-center">
        <input 
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="focus:outline-none foucs:border-blueGray-800 flex-grow apperance-none px-5 py-2 border-2 border-blueGray-300 rounded-md" 
        placeholder="Winguardian Leviosa..." />
        <div onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-blue-100 font-bold mx-4 rounded-md border-2 border-blue-600">Post</div>
      </div>
    </div>
  )
}