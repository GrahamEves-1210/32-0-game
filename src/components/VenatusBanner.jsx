import { useEffect, useRef } from 'react'

export default function VenatusBanner({ phase }) {
  const desktopRef   = useRef(null)
  const mobileRef    = useRef(null)
  const prevPhaseRef = useRef(null)

  function mountAds(scope) {
    desktopRef.current = scope.Config.get('horizontal_sticky').displayBody()
    mobileRef.current  = scope.Config.get('mobile_horizontal_sticky').displayBody()
  }

  function removeAds() {
    desktopRef.current?.remove()
    mobileRef.current?.remove()
  }

  useEffect(() => {
    self.__VM = self.__VM || []
    self.__VM.push((admanager, scope) => {
      mountAds(scope)
      scope.Instances.pageManager.on('navigated', () => {
        scope.Instances.pageManager.newPageSession(false)
      }, false)
    })
    return () => {
      self.__VM = self.__VM || []
      self.__VM.push(() => removeAds())
    }
  }, [])

  useEffect(() => {
    if (prevPhaseRef.current !== null && prevPhaseRef.current !== phase) {
      self.__VM = self.__VM || []
      self.__VM.push((admanager, scope) => {
        removeAds()
        scope.Instances.pageManager.newPageSession(true)
        mountAds(scope)
      })
    }
    prevPhaseRef.current = phase
  }, [phase])

  return null
}
