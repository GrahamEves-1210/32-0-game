import { useEffect, useRef } from 'react'

export default function VenatusBanner({ phase, draftSubPhase }) {
  const desktopRef   = useRef(null)
  const mobileRef    = useRef(null)
  const verticalRef  = useRef(null)
  const bannerRef    = useRef(null)
  const scopeRef     = useRef(null)
  const prevPhaseRef = useRef(null)
  const prevSubPhase = useRef(null)

  function mountAds(scope) {
    desktopRef.current  = scope.Config.get('horizontal_sticky').displayBody()
    mobileRef.current   = scope.Config.get('mobile_horizontal_sticky').displayBody()
    verticalRef.current = scope.Config.verticalSticky().display()
    if (document.getElementById('tournament-top-ad')) {
      try { scope.Config.get('mobile_banner').display('tournament-top-ad') } catch (_) {}
    }
  }

  function removeAds() {
    desktopRef.current?.remove()
    mobileRef.current?.remove()
    verticalRef.current?.remove()
  }

  useEffect(() => {
    self.__VM = self.__VM || []
    self.__VM.push((admanager, scope) => {
      scopeRef.current = scope
      mountAds(scope)
      scope.Instances.pageManager.on('navigated', () => {
        scope.Instances.pageManager.newPageSession()
      }, false)
    })
    return () => {
      self.__VM = self.__VM || []
      self.__VM.push(() => removeAds())
    }
  }, [])

  useEffect(() => {
    if (phase === 'tournament' && prevPhaseRef.current !== 'tournament') {
      self.__VM = self.__VM || []
      self.__VM.push((admanager, scope) => {
        removeAds()
        scope.Instances.pageManager.newPageSession(true)
        mountAds(scope)
      })
    }

    prevPhaseRef.current = phase
  }, [phase])

  useEffect(() => {
    if (draftSubPhase === 'pool' && prevSubPhase.current !== 'pool') {
      if (scopeRef.current && document.getElementById('draft-pool-ad')) {
        try {
          bannerRef.current?.remove()
          bannerRef.current = scopeRef.current.Config.get('mobile_banner').display('draft-pool-ad')
        } catch (_) {}
      }
    }
    if (draftSubPhase === 'spin' && prevSubPhase.current === 'pool') {
      bannerRef.current?.remove()
      bannerRef.current = null
    }
    prevSubPhase.current = draftSubPhase
  }, [draftSubPhase])

  return null
}
