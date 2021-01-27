import React from 'https://esm.sh/react'

export default function Nav(){
  return <nav className="demo">
    <a href="/" className="brand">
      <img className="logo" src="/logo.svg" />
      <span>Web RSA</span>
    </a>

    <div className="menu">
      <a href="#usage" className="pseudo button icon-picture">usage</a>
      <a href="#" className="button icon-puzzle">Plugins</a>
    </div>
  </nav>
}
