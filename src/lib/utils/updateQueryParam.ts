import { NextRouter } from "next/router"

export const addQueryParam = (
  router: NextRouter,
  paramName: string,
  paramValue: string,
) => {
  const query = { ...router.query }
  query[paramName] = paramValue
  router.push(
    {
      pathname: router.pathname,
      query,
    },
    undefined,
    { shallow: true },
  )
}

export const removeQueryParam = (router: NextRouter, paramName: string) => {
  const query = { ...router.query }
  delete query[paramName]

  router.push(
    {
      pathname: router.pathname,
      query,
    },
    undefined,
    { shallow: true },
  )
}

export function setQueryParam(key: string, value: string) {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)

  // Update the browser's history without refreshing the page
  window.history.replaceState({}, "", url.toString())
}

export function deleteQueryParam(key: string) {
  const url = new URL(window.location.href)
  url.searchParams.delete(key)

  // Update the browser's history without refreshing the page
  window.history.replaceState({}, "", url.toString())
}

export function getQueryParam(key: string) {
  const url = new URL(window.location.href)
  return url.searchParams.get(key)
}

export function isQueryParamSet(key: string) {
  const url = new URL(window.location.href)
  return url.searchParams.has(key)
}
