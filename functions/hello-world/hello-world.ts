// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from '@netlify/functions';
import { Call, Client, Index, Login, Match, Time } from 'faunadb';
const { FAUNADB: secret } = process.env;
import safeAwait from '../../safeAwait';

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

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

  //Display the date 1 hour from now
  const oneHourFromNow = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString();
  }

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
