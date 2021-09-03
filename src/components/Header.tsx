import { Icon } from "@iconify/react"
import React, { FC } from "react"

type Props = { }

export const Header: FC<Props> = () => {
  return (
    <div className="w-full py-5 border-b border-blueGray-300 px-12 flex items-center font-bold text-xl">
      <Icon icon="flat-ui:magic" className="text-5xl mr-4"/>
      <div className="">
        <p>Hogwarts Chat</p>
        <span className="font-normal text-sm text-blueGray-500">A demo of user-defined roles, attribute-based access control, and streaming in FaunaDB.</span>
      </div>
    </div>
  )
}