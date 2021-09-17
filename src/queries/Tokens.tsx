import { useMutation, useQuery } from 'react-query'
import { CurrentInstance, FaunaDBLoggedInToken, Token } from '../types'

/**
 * Take user credentials and return 
 * an access token, a refresh token, 
 * and the student. Thorow an error if
 * we get one from the server
 */
const login = async ({ wand, password }: { wand: string, password: string }): Promise<FaunaDBLoggedInToken> => {
  const res: Response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wand, password })
  })
  if (!res.ok) throw new Error(res.statusText)
  return await res.json()
}

/**
 * Revoke the current access token
 * and refresh token
 */
const logout = async (): Promise<void> => {
  const res: Response = await fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error(res.statusText)
}

/**
 * Get a low level public data
 * access token
 */
const publicToken = async (): Promise<CurrentInstance> => {
  const res: Response = await fetch('/api/public')
  if (!res.ok) throw new Error(res.statusText)
  const token: Token = await res.json()
  return { access: token, student: null }
}

/**
 * Take a refresh token and return 
 * a new refresh token, an access token, 
 * and a student
 */
const refreshToken = async (token: string): Promise<FaunaDBLoggedInToken> => {
  const res: Response = await fetch('/api/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  if (!res.ok) throw new Error(res.statusText)
  return await res.json()
}

/**
 * Take a refresh token, go get the access,
 * refresh, and student tokens, return them, 
 * and store the currentStudent and refreshToken locally
 */
const accessTokenFromRefresh = async (token: string): Promise<CurrentInstance> => {
  const { access, student, refresh} = await refreshToken(token)
  localStorage.setItem('refreshToken', JSON.stringify(refresh))
  localStorage.setItem('currentStudent', JSON.stringify(student))
  return { access, student }
}

/** Get a public token. No login required */
export const useToken = () => {
  return useQuery<CurrentInstance, Error>(
    'token',
    async (): Promise<CurrentInstance> => {
      // Check if we have a token already
      const storedRefreshToken = JSON.parse(localStorage.getItem('refreshToken') || 'null')
      // If we do and it hasn't expired, lets refresh the token and return the access token
      if (storedRefreshToken && storedRefreshToken.ttl > Date.now()) 
        return await accessTokenFromRefresh(storedRefreshToken.secret)
      console.log(await publicToken())
      // If we don't have a token, or it has expired, lets just give them a public one.
      return await publicToken()
    },
    {
      // Set the staleTime to 10 minutes, because at that time the token will be expired
      // Although, if you have a public token it will not expire, but checking is ok
      staleTime: 600000
    }
  )
}

// TODO: What is going on here with logout? Probably a mutation
export const useLogin = (wand: string, password: string) => {
  return useQuery<CurrentInstance, Error>(
    'token',
    async (): Promise<CurrentInstance> => {
      // Login in a user
      const { access, student, refresh }: FaunaDBLoggedInToken = await login({ wand, password })
      localStorage.setItem('refreshToken', JSON.stringify(refresh))
      localStorage.setItem('currentStudent', JSON.stringify(student))
      return { access, student }
    },
    {
      // Set the staleTime to 10 minutes, because at that time the token will be expired
      staleTime: 600000
    }
  )
}

// TODO: What is going on here with logout? Probably a mutation
export const useLogout = () => {
  return useMutation<CurrentInstance, Error>(
    'token',
    async (): Promise<CurrentInstance> => {
      // Login in a user
      await logout()
      localStorage.setItem('refreshToken', JSON.stringify(null))
      localStorage.setItem('currentStudent', JSON.stringify(null))
      return await publicToken()
    }
  )
}