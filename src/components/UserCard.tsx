import React, { FC } from "react"
import { useToken } from "../queries/Tokens"

type Props = { }

export const UserCard: FC<Props> = () => {
  const { isLoading, isError, error, isSuccess, data } = useToken()

  return (
    <div className="w-full p-4 rounded-lg bg-blueGray-100">
      { data?.student && <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-red-600 flex-shrink-0 text-red-100 rounded-full flex items-center justify-center text-lg font-semibold">
          HP
          </div>
          <div>
            <p className="text-lg font-bold">{ data.student.data.name }</p>
            <p className="text-sm text-blueGray-500">{ data.student.data.house.name }</p>
          </div>
        </div>
        <div className="bg-blueGray-300 px-4 py-2 text-blueGray-600 font-bold text-sm rounded-md">
          Logout
        </div>
      </div> }
    </div>
  )
}