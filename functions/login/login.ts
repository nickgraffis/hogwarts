import { Handler } from '@netlify/functions';
import { Call, Client } from 'faunadb';
const { FAUNADB: secret } = process.env;
import safeAwait from '../../safeAwait';

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') return {
    statusCode: 403,
    body: "Invalid HTTP Method. POST requests only."
  }

  if (!event.body) return {
    statusCode: 403,
    body: "Please provide credentials inside the body of request!"
  }

  if (!secret) return {
    statusCode: 500,
    body: "Internal Server Error: No FaunaDB server secret is set."
  }

  const client = new Client({ secret })

  const { wand, password } = JSON.parse(event.body)

  const [error, token] = await safeAwait(
    client.query(
      Call("LoginAccount", wand, password)
    )
  )

  console.log(error)

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
