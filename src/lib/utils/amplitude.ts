import {
  identify,
  Identify,
  init,
  setUserId,
  track,
} from "@amplitude/analytics-browser"
import { EVENT_TYPE } from "lib/constants"
import { isDev, isStaging } from "./isEnv"

const { CLICK, IMPRESSION, EVENT, ERROR } = EVENT_TYPE

type BaseProperties = {
  location: string
  userId: string
  accountAddress: string
  safeAddress: string
  flow: string
  chainId: number
  msg: string
  name: string // Vault name
  quorum: number
  members: string[]
  action: string
}

const inactiveTracking =
  (isDev() || isStaging()) && process.env.NEXT_PUBLIC_TRACK !== "true"

export const trackerInit = () => {
  if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string)
  }
}

export const initializeUser = (dynamicId: string) => {
  if (inactiveTracking) {
    return
  }
  const identifyObj = new Identify()
  identify(identifyObj)
  setUserId(dynamicId)
}

export const trackClick = (
  eventName: string,
  metadata: Partial<BaseProperties>,
) => {
  if (inactiveTracking) {
    return
  }

  const {
    location,
    userId,
    accountAddress,
    flow,
    safeAddress,
    chainId,
    name,
    quorum,
    members,
    action,
  } = metadata
  track(eventName, {
    event_category: CLICK,
    location,
    account_address: accountAddress,
    safe_address: safeAddress,
    user_id: userId,
    flow,
    chainId,
    name,
    quorum,
    members,
    action,
  })
}

export const trackImpression = (
  eventName: string,
  metadata: Partial<BaseProperties>,
) => {
  if (inactiveTracking) {
    return
  }

  const { location, userId, accountAddress, flow, chainId, action } = metadata

  track(eventName, {
    event_category: IMPRESSION,
    location,
    account_address: accountAddress,
    user_id: userId,
    flow,
    chainId,
    action,
  })
}

export const trackEvent = (
  eventName: string,
  metadata: Partial<BaseProperties>,
) => {
  if (inactiveTracking) {
    return
  }

  const { location, userId, accountAddress, flow, chainId, action } = metadata

  track(eventName, {
    event_category: EVENT,
    location,
    account_address: accountAddress,
    user_id: userId,
    flow,
    chainId,
    action,
  })
}

export const trackError = (
  eventName: string,
  metadata: Partial<BaseProperties>,
) => {
  if (inactiveTracking) {
    return
  }

  const {
    location,
    userId,
    accountAddress,
    safeAddress,
    flow,
    chainId,
    msg,
    action,
  } = metadata

  track(eventName, {
    event_category: ERROR,
    location,
    account_address: accountAddress,
    safe_address: safeAddress,
    user_id: userId,
    flow,
    chainId,
    msg,
    action,
  })
}

export default trackerInit
