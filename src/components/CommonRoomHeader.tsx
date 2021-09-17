import { Icon } from "@iconify/react"
import React, { FC } from "react"

type Props = {
  houseName: string
}

export const CommonRoomHeader: FC<Props> = ({ houseName }) => (
  <div className="text-xl font-bold flex items-center space-x-4 px-4 w-full pb-8 pt-4">
    {!houseName && <Icon icon="noto:man-mage-medium-light-skin-tone" className="text-3xl" />}
    {houseName === "Gryffindor" && <Icon icon="emojione:lion-face" className="text-3xl" />}
    {houseName === "Slytherin" && <Icon icon="emojione:snake" className="text-3xl" />}
    {houseName === "Ravenclaw" && <Icon icon="emojione:owl" className="text-3xl" />}
    {houseName === "Hufflepuff" && <Icon icon="noto:badger" className="text-5xl -mt-3" />}
    {houseName === "Public" && <Icon icon="flat-ui:magic" className="text-3xl"/>}
    <p>{ houseName } Common Room</p>
  </div>
)