import { Client, Map, Paginate, Match, Index, Lambda, Get, Var, CurrentIdentity, CurrentToken, Collection, Ref } from 'faunadb'
import React, { FC, useState } from 'react'
import { useEffect } from 'react'
import safeAwait from '../safeAwait'

type Props = { }

export const App: FC<Props> = () => {
  const [key, setKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/hello-world', {
      method: 'POST',
      body: JSON.stringify({
        wand: "holly-phoenix",
        password: "harrypotter"
      })
    })
    .then(res => {
      if (!res.ok) {
        console.log(res)
        throw Error(res);
      }
      return res;
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      setKey(res.tokens.access.secret)
      console.log(res.tokens.access.secret)
    })
    .catch(err => {
      console.log(err)
      setError(err.toString())
    })
  }, [])

  const fetchConversations = async (key: string) => {
    const client = new Client({
      secret: key
    })
    const [error, data] = await safeAwait(
      client.query(
        Map(
          Paginate(
            Match(Index("all_conversations"))
          ), 
          Lambda(
            'conversation', Get(Var('conversation'))
          )
        )
      )
    )

    if (error) console.log(error)
    if (data) setConversations(data.data.map((c: any) => c.data.message))
    console.log(data)
  }

  useEffect(() => {
    key && fetchConversations(key)
  }, [key])

  return (
    <div className="text-center">
      { key ? 
        <p className="font-bold text-xl">{ key }</p> :
        <p className="font-bold text-xl">{ 'Not Logged In' }</p>
      }
      { error && <p className="font-bold text-red-400 text-xl">{ error }</p> }
      <ul>
        { conversations.map(conversation => <li key={ conversation }>{ conversation }</li>) }
      </ul>
    </div>
  )
}