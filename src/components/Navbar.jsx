import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppState } from '../store/AppState'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
    isActive ? 'bg-ink text-canvas' : 'text-ink/70 hover:bg-accent-light/60'
  }`

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { cart, role, resetRole } = useAppState()
  const isArtist = role === 'artista'

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/explorar${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <NavLink to="/" className="shrink-0 font-serif text-2xl font-semibold italic tracking-tight text-accent">
          ColectArt
        </NavLink>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md sm:block">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Buscar artistas, obras, países..."
            className="w-full rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm outline-none focus:border-ink/40"
          />
        </form>

        <nav className="ml-auto flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Feed
          </NavLink>
          <NavLink to="/explorar" className={linkClass}>
            Explorar
          </NavLink>
          <NavLink to="/subastas" className={linkClass}>
            Subastas
          </NavLink>
          {isArtist && (
            <NavLink to="/perfil/a9" className={linkClass}>
              Mi perfil
            </NavLink>
          )}
          <NavLink to="/carrito" className={linkClass}>
            <span className="relative">
              Carrito
              {cart.size > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                  {cart.size}
                </span>
              )}
            </span>
          </NavLink>
        </nav>

        {isArtist && (
          <NavLink
            to="/publicar"
            className="ml-1 shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-dark"
          >
            + Publicar obra
          </NavLink>
        )}

        <button
          onClick={resetRole}
          className="ml-1 shrink-0 text-xs text-ink/30 hover:text-ink/60"
          title="Cambiar entre modo artista y coleccionista"
        >
          Cambiar modo
        </button>
      </div>
    </header>
  )
}
