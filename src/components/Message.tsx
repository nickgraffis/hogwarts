import { Icon } from "@iconify/react"
import React, { FC } from "react"
import { houseColor } from "../logics/houseColors"
import { time } from "../logics/simpleTime"
import { Message as MessageType } from "../types"

type Props = {
  message: MessageType
}

export const Message: FC<Props> = ({ message }) => (
  <div className="flex space-x-4">
    <div className={`w-8 h-8 ${houseColor(message.data.student.data.house.data.name)} flex-shrink-0 rounded-full flex items-center justify-center text-xs font-semibold`}>
    {message.data.student.data.name.split(" ")[0][0] + message.data.student.data.name.split(" ")[1][0]}
    </div>
    <div className="space-y-4 flex-grow">
      <div className="w-full flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <p className="font-semibold text-sm">{message.data.student.data.name}</p>
          {
            message.data.student.data.prefict &&
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          {
            message.data.public && 
            <div className="px-2 py-1 text-[10px] bg-blueGray-300 text-blueGray-500 font-bold rounded-md">PUBLIC</div>
          }
          <div className={`px-2 py-1 text-[10px] ${houseColor(message.data.student.data.house.data.name)} font-bold rounded-md`}>
            {message.data.student.data.house.data.name}
          </div>
        </div>
        <p className="text-blueGray-600 text-xs">
          {time(message.data.createdAt.value)} {message.data.edited && <span>(edited)</span>}
        </p>
      </div>
      <p>
        { message.data.message }            
      </p>
    </div>
  </div>
)