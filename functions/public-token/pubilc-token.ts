// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from '@netlify/functions';
import { Client, Create, Now, Role, TimeAdd, Tokens } from 'faunadb';
const { FAUNADB: secret } = process.env;
import safeAwait from '../../safeAwait';

const handler: Handler = async (event, context) => {
  const client = secret && new Client({ secret })

  if (!client) return {
    statusCode: 500,
    body: "Internal Server Error: No FaunaDB key set."
  }

  // Create a public token that will expire in 60 min
  const [error, token] = await safeAwait(
    client.query(
      Create(
        Tokens(),
        {
          instance: Role("Public"),
          ttl: TimeAdd(Now(), 600, 'seconds'),
        },
      )
    )
  )

  if (error) return {
    statusCode: parseInt(error.requestResult.statusCode),
    body: JSON.stringify(error.description)
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(token)
  }
}

module.exports = { handler }
