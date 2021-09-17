import { Handler } from '@netlify/functions';
const { FAUNADB_PUBLIC_TOKEN } = process.env;
import { Token } from '../../src/types';

const handler: Handler = async () => {
  if (!FAUNADB_PUBLIC_TOKEN) return {
    statusCode: 500,
    body: 'Internal Server Error: No Public FaunaDB Token provided in applications enviornment.'
  }

  const token: Token = {
    ref: '',
    ts: new Date(Date.now()),
    instance: '',
    ttl: {
      // Why 1 year from now?
      // We need a ttl to return, and since this public token
      // will check after each session, we just want to make
      // sure that it is never invalidated. Unless the session
      // changes, which probbaly won't happen after a year.
      '@ts': new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    },
    secret: FAUNADB_PUBLIC_TOKEN
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(token)
  }
}

module.exports = { handler }
