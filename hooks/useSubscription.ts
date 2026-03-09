import { useCallback, useEffect, useState } from 'react'
import { checkSubscription, getOfferings, purchasePackage } from '../lib/revenuecat'
import { useUserStore } from '../stores/userStore'
import { PurchasesPackage } from 'react-native-purchases'

export function useSubscription() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { updateSubscription } = useUserStore()

  const loadOfferings = useCallback(async () => {
    setIsLoading(true)
    try {
      const pkgs = await getOfferings()
      setPackages(pkgs)
    } catch (err) {
      console.error('Failed to load offerings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      setIsLoading(true)
      try {
        const isPro = await purchasePackage(pkg)
        if (isPro) {
          updateSubscription('pro')
        }
        return isPro
      } catch (err) {
        console.error('Purchase failed:', err)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [updateSubscription]
  )

  const checkStatus = useCallback(async () => {
    try {
      const isPro = await checkSubscription()
      updateSubscription(isPro ? 'pro' : 'free')
      return isPro
    } catch {
      return false
    }
  }, [updateSubscription])

  useEffect(() => {
    loadOfferings()
  }, [loadOfferings])

  return { packages, isLoading, purchase, checkStatus, loadOfferings }
}
