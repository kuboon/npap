import { generateKeyPair } from '../lib/crypto.ts'
import { Link } from 'https://deno.land/x/aleph/mod.ts'
import React, { useState, useEffect } from 'react'

export default function Home () {
  const [secretPath, setPath] = useState('')
  useEffect(() => {
    generateKeyPair().then((k: any) => {
      const p = new URLSearchParams()
      Object.entries<string>(k).forEach(([k, v]) => p.append(k, v))
      setPath(`/secret#${p.toString()}`)
    })
  }, [])

  return (
    <div className='page'>
      <Link to={secretPath}>Generate key</Link>
    </div>
  )
}
