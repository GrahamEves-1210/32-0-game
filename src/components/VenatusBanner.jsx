import { useEffect, useRef } from 'react'

export default function VenatusBanner({ phase }) {
  const placementRef = useRef(null)
  const prevPhaseRef = useRef(null)

  useEffect(() => {
    self.__VM = self.__VM || []
    self.__VM.push((admanager, scope) => {
      placementRef.current = scope.Config.get('horizontal_sticky').displayBody()
      scope.Instances.pageManager.on('navigated', () => {
        scope.Instances.pageManager.newPageSession(false)
      }, false)
    })
    return () => {
      self.__VM = self.__VM || []
      self.__VM.push(() => { placementRef.current?.remove() })
    }
  }, [])

  useEffect(() => {
    if (prevPhaseRef.current !== null && prevPhaseRef.current !== phase) {
      self.__VM = self.__VM || []
      self.__VM.push((admanager, scope) => {
        placementRef.current?.remove()
        scope.Instances.pageManager.newPageSession(true)
        placementRef.current = scope.Config.get('horizontal_sticky').displayBody()
      })
    }
    prevPhaseRef.current = phase
  }, [phase])

  return null
}
