import { createContext, useContext, useMemo, useState } from 'react'
import { artworks as initialArtworks, auctions as initialAuctions } from '../data/mockData'

const AppStateContext = createContext(null)
const ROLE_KEY = 'colectart_role'

export function AppStateProvider({ children }) {
  const [artworksState, setArtworksState] = useState(initialArtworks)
  const [auctionsState, setAuctionsState] = useState(initialAuctions)
  const [liked, setLiked] = useState(() => new Set())
  const [following, setFollowing] = useState(() => new Set())
  const [cart, setCart] = useState(() => new Set())
  const [role, setRoleState] = useState(() => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(ROLE_KEY)
  })

  function setRole(nextRole) {
    setRoleState(nextRole)
    if (typeof window !== 'undefined') {
      if (nextRole) window.localStorage.setItem(ROLE_KEY, nextRole)
      else window.localStorage.removeItem(ROLE_KEY)
    }
  }

  function resetRole() {
    setRole(null)
  }

  function toggleLike(artworkId) {
    setLiked((prev) => {
      const next = new Set(prev)
      next.has(artworkId) ? next.delete(artworkId) : next.add(artworkId)
      return next
    })
  }

  function toggleFollow(artistId) {
    setFollowing((prev) => {
      const next = new Set(prev)
      next.has(artistId) ? next.delete(artistId) : next.add(artistId)
      return next
    })
  }

  function buyArtwork(artworkId) {
    setArtworksState((prev) =>
      prev.map((w) => (w.id === artworkId ? { ...w, sold: true } : w)),
    )
  }

  function addToCart(artworkId) {
    setCart((prev) => new Set(prev).add(artworkId))
  }

  function removeFromCart(artworkId) {
    setCart((prev) => {
      const next = new Set(prev)
      next.delete(artworkId)
      return next
    })
  }

  function checkoutCart() {
    setArtworksState((prev) => prev.map((w) => (cart.has(w.id) ? { ...w, sold: true } : w)))
    setCart(new Set())
  }

  function placeBid(auctionId, amount, bidder = 'tu_usuario') {
    setAuctionsState((prev) =>
      prev.map((auc) => {
        if (auc.id !== auctionId) return auc
        if (amount <= auc.currentBid) return auc
        return {
          ...auc,
          currentBid: amount,
          currentBidder: bidder,
          bidHistory: [...auc.bidHistory, { bidder, amount, time: Date.now() }],
        }
      }),
    )
  }

  const value = useMemo(
    () => ({
      artworks: artworksState,
      auctions: auctionsState,
      liked,
      following,
      cart,
      role,
      setRole,
      resetRole,
      toggleLike,
      toggleFollow,
      buyArtwork,
      placeBid,
      addToCart,
      removeFromCart,
      checkoutCart,
    }),
    [artworksState, auctionsState, liked, following, cart, role],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState debe usarse dentro de AppStateProvider')
  return ctx
}
