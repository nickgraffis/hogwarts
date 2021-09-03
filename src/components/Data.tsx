import React, { FC, useState } from "react"
import { House } from "./Houses"

export type Token = {
  ref: string,
  data: {
    name: string,
    house: House
  }
}

type Props = { }

export const Data: FC<Props> = () => {
  const [tokens, setTokens] = useState<Token | null>(null)

  return (
    <div className="space-y-3">
      <p>Current Tokens</p>
      <pre className="bg-blueGray-600 text-blueGray-200 rounded-md p-4">
        &#123;<br/>
          <span className="flex w-full justify-between items-center">
            <span className="flex items-center">
              &nbsp; &nbsp;<span className="text-lime-400">access: &nbsp;</span> <span className="w-36 truncate inline-block">{accessToken?.secret}</span>,
            </span>
            { timeLeft(accessToken?.ttl['@ts'])}
          </span>
          <span className="flex w-full justify-between items-center">
            <span className="flex items-center">
              &nbsp; &nbsp;<span className="text-lime-400">refresh: &nbsp;</span> <span className="w-36 truncate inline-block">{refreshToken?.secret}</span>,
            </span>
            { timeLeft(refreshToken?.ttl['@ts'])}
          </span>
          <span className="flex w-full justify-between items-center">
            <span className="flex items-center">
              &nbsp; &nbsp;<span className="text-lime-400">student: &nbsp;</span> <span className="w-36 inline-block"><span className="text-purple-400">Ref</span>({student?.ref['@ref'].id})</span>
            </span>
          </span>
        &#125;
      </pre>
    </div>
  )
}