import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

const USER_ID = crypto.randomUUID()

export default function useOnlineCount() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    const channel = supabase.channel('online-users', {
      config: { presence: { key: USER_ID } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        setCount(Object.keys(channel.presenceState()).length)
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
