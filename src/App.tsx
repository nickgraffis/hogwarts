import { QueryClient, QueryClientProvider, setLogger } from 'react-query'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Header } from './components/Header';
import { Houses } from './components/Houses';
import { MessageBoard } from './components/MessageBoard';
import { UserCard } from './components/UserCard';
import { Data } from './components/Data';
import { useToken } from './queries/Tokens';
import FaunaStream from './queries/FaunaStream';
import faunadb from "faunadb"
import { Notes } from './components/Notes';

type Props = { }

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false
    }
  }
});

export type HouseContextType = {
  house: any;
  setHouse: (house: any) => void;
  houseStream: FaunaStream | undefined;
  setHouseStream: (stream: FaunaStream) => void;
  startStream: (docId: number | string) => void;
}

export const HouseContext = React.createContext<HouseContextType>(
  { 
    house: {},
    setHouse: () => console.warn('No house provider defiend'),
    houseStream: undefined,
    setHouseStream: () => console.warn('No houseStream provider defiend'),
    startStream: () => console.warn('No startStream provider defiend')
  }
);

export const useCurrentHouse = () => useContext(HouseContext);

export const QueryProvider: FC<Props> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

const HogwartsChat: FC<{}> = () => {
  const [house, setHouse] = useState<any>({
    data: {
      name: "Public", 
      mascot: "", 
      founder: "Godric Gryffindor, Rowena Ravenclaw, Helga Hufflepuff and Salazar Slytherin", 
      head: "Albus Dumbledor", 
      history: []
    },
    ref: { value: { id: "309185714557289025"} },
    ts: 1631121325163000
  });

  const [houseStream, setHouseStream] = useState<FaunaStream>()
  const { 
    data: token, 
    isLoading: loadingToken, 
    isError: tokenError, 
    isSuccess: tokenSuccess, 
    error: tokenErrorMessage,
  } = useToken()

  const startStream  = async (docId: number | string) => {
    if (!token || !tokenSuccess) return
    const secret = token?.access.secret
    const client = new faunadb.Client({ secret })
    if (houseStream) houseStream.destroy()
    setHouseStream(new FaunaStream(client, docId))
  }

  useEffect(() => {
    if (house?.ref?.value.id) 
      startStream(house?.ref?.value.id)
  }, [house])
  
  useEffect(() => {
    houseStream?.onUpdate.add((signal: any) => {
      console.log(signal)
      if (signal.event == 'error') console.warn(signal.data)
      if (signal.event == 'destroy') setHouseStream(undefined)
      console.log(signal)
    })
  }, [houseStream])

  return (
    <HouseContext.Provider value={{ house, setHouse, houseStream, setHouseStream, startStream }}>
      <div className="max-h-screen h-screen">
        <Header />
        {/* 
          * Because the header is at the top of of the page absolute, the content
          * starts after 24 units - the header being a height of 24 units.
        */}
        <div className="flex h-full w-full pt-24">
          <Houses />
          <MessageBoard />
          <div className="w-4/12 border-l border-blueGray-300 p-6 space-y-8">
            {/* <UserCard />
            <Data /> */}
            <Notes />
          </div>
        </div>
      </div>
    </HouseContext.Provider>
    
  )
}

export const App: FC<Props> = () => {
  // On initial load, we can go get a fresh token. 
  // If we have a stored refresh token that hasn't expired, we'll just 
  // log the user in with that. Otherwise it will return a public token.
  const { isLoading, error, isError, isSuccess, data } = useToken()

  return (
    <div>
      { isLoading && <div>Loading...</div> }
      { (isError && error) && <div>Error: {error.message}</div> }
      { (isSuccess && data) && <HogwartsChat /> }
    </div>
  )
}