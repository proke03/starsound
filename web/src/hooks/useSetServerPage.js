import { useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useParams } from 'react-router-dom'

export const useSetServerPage = page => {
  const { server } = useParams()
  const setServerPage = useStore(s => s.setServerPage)
  useEffect(() => {
    if (page == null) return
    setServerPage(server.substring(0), page)
  }, [page, server, setServerPage])
}
