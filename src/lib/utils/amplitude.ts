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
  pageName: string
  userId: string
  accountAddress: string
  safeAddress: string
  mobile: boolean
  flow: string
  chainId: number
  msg: string
  name: string // Project name
  quorum: number
  members: string[]
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
    pageName,
    userId,
    accountAddress,
    mobile,
    flow,
    safeAddress,
    chainId,
    name,
    quorum,
    members,
  } = metadata
  track(eventName, {
    event_category: CLICK,
    page: pageName,
    account_address: accountAddress,
    safe_address: safeAddress,
    user_id: userId,
    mobile,
    flow,
    chainId,
    name,
    quorum,
    members,
  })
}

export const trackImpression = (
  eventName: string,
  metadata: Partial<BaseProperties>,
) => {
  if (inactiveTracking) {
    return
  }

  const { pageName, userId, accountAddress, mobile, flow, chainId } = metadata

  track(eventName, {
    event_category: IMPRESSION,
    page: pageName,
    account_address: accountAddress,
    user_id: userId,
    flow,
    mobile,
    chainId,
  })
}

export const trackEvent = (
  eventName: string,
  metadata: Partial<BaseProperties>,
) => {
  if (inactiveTracking) {
    return
  }

  const { pageName, userId, accountAddress, mobile, flow, chainId } = metadata

  track(eventName, {
    event_category: EVENT,
    page: pageName,
    account_address: accountAddress,
    user_id: userId,
    flow,
    mobile,
    chainId,
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
    pageName,
    userId,
    accountAddress,
    safeAddress,
    mobile,
    flow,
    chainId,
    msg,
  } = metadata

  track(eventName, {
    event_category: ERROR,
    page: pageName,
    account_address: accountAddress,
    safe_address: safeAddress,
    user_id: userId,
    flow,
    mobile,
    chainId,
    msg,
  })
}

export default trackerInit
