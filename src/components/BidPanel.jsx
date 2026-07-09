import { useState } from 'react'
import { useAppState } from '../store/AppState'
import CountdownTimer from './CountdownTimer'

export default function BidPanel({ auction }) {
  const { placeBid } = useAppState()
  const [amount, setAmount] = useState(auction.currentBid + 50)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const isOver = auction.endTime - Date.now() <= 0

  function handleSubmit(e) {
    e.preventDefault()
    if (amount <= auction.currentBid) {
      setError(`Tu puja debe ser mayor a $${auction.currentBid.toLocaleString()}`)
      return
    }
    placeBid(auction.id, Number(amount))
    setError('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-red-600">Subasta en vivo</span>
        <span className="text-sm text-ink/60">
          Termina en <CountdownTimer endTime={auction.endTime} className="font-semibold text-ink" />
        </span>
      </div>

      <p className="mb-3 text-xs text-ink/40">El artista eligió vender esta obra por subasta.</p>

      <p className="text-sm text-ink/60">Puja actual</p>
      <p className="mb-4 font-serif text-3xl font-semibold">${auction.currentBid.toLocaleString()}</p>
      {auction.currentBidder && (
        <p className="mb-4 text-xs text-ink/50">Máxima puja de @{auction.currentBidder}</p>
      )}

      {!isOver ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            min={auction.currentBid + 1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-full border border-ink/15 px-4 py-2 text-sm"
          />
          <button type="submit" className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
            Pujar
          </button>
        </form>
      ) : (
        <p className="rounded-full bg-ink/5 px-4 py-2 text-center text-sm text-ink/60">Subasta finalizada</p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {success && <p className="mt-2 text-xs text-green-600">¡Puja registrada!</p>}

      {auction.bidHistory.length > 0 && (
        <div className="mt-5 border-t border-ink/10 pt-3">
          <p className="mb-2 text-xs font-semibold text-ink/50">Historial de pujas</p>
          <ul className="space-y-1 text-xs text-ink/60">
            {[...auction.bidHistory]
              .reverse()
              .slice(0, 5)
              .map((bid, i) => (
                <li key={i} className="flex justify-between">
                  <span>@{bid.bidder}</span>
                  <span>${bid.amount.toLocaleString()}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
