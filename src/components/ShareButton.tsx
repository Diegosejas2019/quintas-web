'use client'

interface Props {
  quintaId: string
  quintaNombre: string
  className?: string
}

export default function ShareButton({ quintaId, quintaNombre, className = '' }: Props) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/quintas/${quintaId}`
    const text = encodeURIComponent(`Mirá esta quinta 🏡 ${quintaNombre}\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartir por WhatsApp"
      className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm transition-colors hover:bg-white ${className}`}
    >
      ↗
    </button>
  )
}
