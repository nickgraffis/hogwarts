import { Icon } from "@iconify/react"
import React, { FC } from "react"

type Props = { }

export const Header: FC<Props> = () => {
  // The header is absolutely positioned at the top of the page.
  return (
    <div className="absolute top-0 w-full h-24 border-b border-blueGray-300 px-12 flex items-center font-bold text-xl">
      <Icon icon="flat-ui:magic" className="text-5xl mr-4"/>
      <div className="">
        <p>Hogwarts Chat</p>
        <span className="font-normal text-sm text-blueGray-500">A demo of user-defined roles, attribute-based access control, and streaming in FaunaDB.</span>
      </div>
    </div>
  )
}