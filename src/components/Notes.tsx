import { Icon } from "@iconify/react"
import React, { FC, useEffect, useState } from "react"
import { useCurrentHouse } from "../App"
import { useLogin, useToken } from "../queries/Tokens"

export const Notes: FC<{}> = () => {
  const { house, houseStream, startStream: globalStartStream } = useCurrentHouse()
  const [data, setData] = useState<any>()
  const [event, setEvent] = useState<any>()
  const [tokenExpiry, setTokenExpiry] = useState<Date>();
  const [counter, setCounter] = useState(0);
  const { 
    data: token, 
    isLoading: loadingToken, 
    isError: tokenError, 
    isSuccess: tokenSuccess, 
    error: tokenErrorMessage,
  } = useToken()
  useEffect(() => {
    houseStream?.onUpdate.add(({data, event}: any) => {
      console.log(data, event)
      setData(data)
      setEvent(event)
    })
  }, [houseStream])

  useEffect(() => {
    setTokenExpiry(token?.access.ttl['@ts'])
    console.log(token?.access.ttl['@ts'])
  }, [token])

  useEffect(() => {
    tokenExpiry && setCounter(new Date(tokenExpiry).getSeconds() - new Date().getSeconds())
  }, [tokenExpiry])

  useEffect(() => {
    counter > 0 && 
    setInterval(() => {
      setCounter(counter - 1)
    }, 1000)
  }, [counter])
  const logInUser = useLogin
  const login = () => logInUser('holly-phoenix', '12345')
  const stopStream = () => houseStream && houseStream.destroy()
  const startStream = () => {
    globalStartStream(house?.ref?.value.id)
  }
  return (<div className="h-full overflow-scroll">
    <p className="text-xl font-bold mb-4">Demonstration Notes & Playground:</p>
    <div className="text-lg font-bold mb-2 flex space-x-2 items-baseline">
      <Icon icon="eva:radio-fill" />
      <p className="">FaunaDB Streaming:</p>
    </div>
    <div className="flex space-x-2 items-center">
      <span>Currently streaming document ref:</span>
      { houseStream ?
        <div onClick={stopStream} className="px-4 rounded-lg py-2 bg-rose-400 text-rose-800 text-xs font-semibold">
          Stop Stream
        </div>
        :
        <div onClick={startStream} className="px-4 rounded-lg py-2 bg-green-400 text-green-800 text-xs font-semibold">
          Start Stream
        </div>
      }
    </div>
    <div className="flex space-x-2 items-center font-mono bg-blueGray-800 px-2 py-4 my-1 rounded-lg overflow-scroll">
      <div className={`w-2 h-2 ${houseStream ? 'bg-green-400' : 'bg-rose-400'} rounded-full flex-shrink-0`} />
      <div className="whitespace-nowrap">{houseStream ? <div>
        <span className="text-green-400">Ref</span>
        <span className="text-white">(</span>
        <span className="text-green-400">Collection</span>
        <span className="text-white">(</span>
        <span className="text-yellow-400">"houses"</span>
        <span className="text-white">), </span>
        <span className="text-yellow-400">"{houseStream?.documentId}"</span>
        <span className="text-white">)</span>
        </div> : <span className="italic text-rose-400">Error: Not currently streaming document.</span>}</div>
    </div>
    {houseStream ?
    <div>
      <span>Most recent event: <code>{event}</code></span>
      <pre className="bg-blueGray-800 text-white w-full overflow-scroll rounded-lg p-4 h-56">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
    : <div>
      <span>Most recent event: <code>{event}</code></span>
      <pre className="bg-blueGray-800 italic text-rose-400 w-full overflow-scroll rounded-lg p-4 h-56">
        Error: Not currently streaming document.
      </pre>
    </div>
    }
    <div className="text-lg font-bold flex space-x-2 items-baseline my-4">
      <Icon icon="eva:lock-fill" />
      <p className="">FaunaDB Token:</p>
    </div>
    <div className="flex space-x-2 items-baseline my-2">
      <Icon icon="fluent:key-20-filled" />
      <p className="">Token:</p>
    </div>
    <pre className="bg-blueGray-800 text-white w-full overflow-scroll rounded-lg p-4">
      {token && token.access.secret}
    </pre>
    <div className="flex space-x-2 items-baseline my-2">
      <Icon icon="eva:clock-fill" />
      <p className="">Token Expires In:</p>
      {
        token?.student ?
        <p>{counter} seconds</p>
        :
        <p className="italic">Public tokens do not expire</p>
      }
    </div>
    <div className="flex space-x-2 items-baseline my-2">
      <Icon icon="eva:person-fill" />
      <p className="">Current Student:</p>
    </div>
    {
      (token && token.student) ?
      <p></p>
      :
      <div>
        <p>You are not currently logged in.</p>
        <div className="space-y-4">
          <input className="p-2 appearance-none border-4 border-blueGray-800 rounded-lg w-full" placeholder="Wand"/>
          <input className="p-2 appearance-none border-4 border-blueGray-800 rounded-lg w-full" placeholder="Password" type="password" />
        </div>
        <div className="flex w-full justify-between space-x-4">
          <div onClick={login} className="px-4 flex-grow flex py-2 justify-center my-2 font-semibold bg-blueGray-800 border-4 border-blueGray-800 rounded-lg text-white">Log In</div>
          <div className="px-4 flex py-2 justify-center my-2 font-semibold bg-white border-4 border-blueGray-800 rounded-lg text-blueGray-800">Register</div>
        </div>
      </div>
    }
  </div>)
}