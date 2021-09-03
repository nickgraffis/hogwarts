import { useQuery } from 'react-query'
import { CurrentInstance, FaunaDBLoggedInToken, Token } from '../types'

// TODO: Catch errors over here
const login = async ({ wand, password }: { wand: string, password: string }): Promise<FaunaDBLoggedInToken> => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wand, password })
  })
  return await res.json()
}

// TODO: Catch errors over here
const logout = async (): Promise<void> => {
  await fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
}

// TODO: Catch errors over here
const publicToken = async (): Promise<CurrentInstance> => {
  const res = await fetch('/api/public')
  const token = await res.json()
  return {
    access: token,
    student: null
  }
}

// TODO: Catch errors over here
const refreshToken = async (token: string): Promise<FaunaDBLoggedInToken> => {
  const res = await fetch('/api/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  return await res.json()
}

const accessTokenFromRefresh = async (token: string): Promise<CurrentInstance> => {
  const { access, student, refresh} = await refreshToken(token)
  localStorage.setItem('refreshToken', JSON.stringify(refresh))
  localStorage.setItem('currentStudent', JSON.stringify(student))
  return {
    access,
    student
  }
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
      
      // If we don't have a token, or it has expired, lets just give them a public one.
      return await publicToken()
    },
    {
      // Set the staleTime to 10 minutes, because at that time the token will be expired
      staleTime: 600000
    }
  )
}

export const useLogin = (wand: string, password: string) => {
  return useQuery<CurrentInstance, Error>(
    'token',
    async (): Promise<CurrentInstance> => {
      // Login in a user
      const { access, student, refresh }: FaunaDBLoggedInToken = await login({ wand, password })
      localStorage.setItem('refreshToken', JSON.stringify(refresh))
      localStorage.setItem('currentStudent', JSON.stringify(student))
      return {
        access,
        student
      }
    },
    {
      // Set the staleTime to 10 minutes, because at that time the token will be expired
      staleTime: 600000
    }
  )
}

export const useLogout = () => {
  return useQuery<CurrentInstance, Error>(
    'token',
    async (): Promise<CurrentInstance> => {
      // Login in a user
      await logout()
      localStorage.setItem('refreshToken', JSON.stringify(null))
      localStorage.setItem('currentStudent', JSON.stringify(null))
      return await publicToken()
    },
    {
      // Set the staleTime to 10 minutes, because at that time the token will be expired
      staleTime: 600000
    }
  )
}