'use client'

import FavoriteButton from '@/components/FavoriteButton'
import ShareButton from '@/components/ShareButton'
import type { Quinta } from '@/types/types'

interface Props {
  quinta: Quinta
}

export default function DetailActions({ quinta }: Props) {
  return (
    <div className="flex gap-2">
      <ShareButton quintaId={quinta.id} quintaNombre={quinta.nombre} />
      <FavoriteButton quinta={quinta} />
    </div>
  )
}
