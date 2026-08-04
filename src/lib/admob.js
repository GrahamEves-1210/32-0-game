import { Capacitor } from '@capacitor/core'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'

const AD_UNITS = {
  ios: {
    banner:       'ca-app-pub-1024739025144515/5041130146',
    interstitial: 'ca-app-pub-1024739025144515/1060542593',
  },
  android: {
    banner:       'ca-app-pub-1024739025144515/5372036703',
    interstitial: 'ca-app-pub-1024739025144515/8705042986',
  },
}

const TEST_UNITS = {
  banner:       'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
}

const isDev = import.meta.env.DEV

function units() {
  if (isDev) return TEST_UNITS
  return AD_UNITS[Capacitor.getPlatform()] ?? TEST_UNITS
}

export async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return
  if (Capacitor.getPlatform() === 'ios') {
    await AdMob.requestTrackingAuthorization()
  }
  await AdMob.initialize({ testingDevices: [], initializeForTesting: isDev })
}

export async function showBanner() {
  if (!Capacitor.isNativePlatform()) return
  await AdMob.showBanner({
    adId: units().banner,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
  })
}

export async function hideBanner() {
  if (!Capacitor.isNativePlatform()) return
  await AdMob.hideBanner()
}

export async function showInterstitial() {
  if (!Capacitor.isNativePlatform()) return
  await AdMob.prepareInterstitial({ adId: units().interstitial })
  await AdMob.showInterstitial()
}
