'use client'

interface Props {
  promedio: number // 0-10 scale from backend
  size?: number
}

export default function StarRating({ promedio, size = 14 }: Props) {
  const rating = promedio / 2 // convert 0-10 → 0-5

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(star => {
        const fill = Math.min(1, Math.max(0, rating - (star - 1)))
        const percent = Math.round(fill * 100)
        return (
          <svg key={star} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`star-${star}-${Math.round(promedio * 10)}`}>
                <stop offset={`${percent}%`} stopColor="#F59E0B" />
                <stop offset={`${percent}%`} stopColor="#D1C4B8" />
              </linearGradient>
            </defs>
            <path
              d="M10 1l2.39 5.26 5.61.47-4.15 3.7 1.3 5.57L10 13.27l-5.15 2.73 1.3-5.57L2 6.73l5.61-.47z"
              fill={`url(#star-${star}-${Math.round(promedio * 10)})`}
            />
          </svg>
        )
      })}
    </span>
  )
}
