import React from 'react'
import ReactDOM from 'react-dom'
import './tailwind.css'
import { QueryProvider } from './App'

ReactDOM.render(
  <React.StrictMode>
    <QueryProvider />
  </React.StrictMode>,
  document.getElementById('root')
)
