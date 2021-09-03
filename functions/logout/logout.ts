// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from '@netlify/functions';
import { Call, Client } from 'faunadb';
const { FAUNADB: secret } = process.env;
import safeAwait from '../../safeAwait';

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return {
    statusCode: 403,
    body: "Invalid HTTP Method. POST requests only."
  }

  if (!secret) return {
    statusCode: 500,
    body: "Internal Server Error: No FaunaDB server secret is set."
  }

  const client = new Client({ secret })

  const [error, token] = await safeAwait(
    client.query(
      Call("LogoutAccount")
    )
  )

  console.log(error)

  if (error) return {
    statusCode: parseInt(error.requestResult.statusCode),
    body: JSON.stringify(error.description)
  }
  
  return {
    statusCode: 200,
    body: 'Logged Out Successfully!'
  }
}

module.exports = { handler }