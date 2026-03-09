import Purchases, { PurchasesPackage } from 'react-native-purchases'

export function initRevenueCat() {
  Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY! })
}

export async function getOfferings() {
  const offerings = await Purchases.getOfferings()
  return offerings.current?.availablePackages ?? []
}

export async function purchasePackage(pkg: PurchasesPackage) {
  const { customerInfo } = await Purchases.purchasePackage(pkg)
  return customerInfo.entitlements.active['pro'] !== undefined
}

export async function checkSubscription(): Promise<boolean> {
  const info = await Purchases.getCustomerInfo()
  return info.entitlements.active['pro'] !== undefined
}
