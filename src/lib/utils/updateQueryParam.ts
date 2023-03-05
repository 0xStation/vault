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
