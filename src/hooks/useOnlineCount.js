import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function useOnlineCount() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    const channel = supabase.channel('online-users')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setCount(Object.values(state).flat().length)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ at: Date.now() })
        }
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  return count
}
