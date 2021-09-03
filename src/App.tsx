import { QueryClient, QueryClientProvider } from 'react-query'
import React, { FC } from 'react'
import { Header } from './components/Header';
import { Houses } from './components/Houses';
import { MessageBoard } from './components/MessageBoard';
import { UserCard } from './components/UserCard';
import { Data } from './components/Data';
import { useToken } from './queries/Tokens';

type Props = { }

const queryClient = new QueryClient()

const HogwartsChat: FC<{}> = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-12 gap-4 flex-grow">
        <Houses />
        <MessageBoard />
        <div className="col-span-4 border-l border-blueGray-300 p-6 space-y-8">
          <UserCard />
          <Data />
          {/* Notes */}
        </div>
      </div>
    </div>
  )
}

export const App: FC<Props> = () => {
  // On initial load, we can go get a fresh token. 
  // If we have a stored refresh token that hasn't expired, we'll just 
  // log the user in with that. Otherwise it will return a public token.
  const { isLoading, error, isError, isSuccess, data } = useToken()

  return (
    <QueryClientProvider client={queryClient}>
      { isLoading && <div>Loading...</div> }
      { (isError && error) && <div>Error: {error.message}</div> }
      { (isSuccess && data) && <HogwartsChat /> }
    </QueryClientProvider>
  )
}