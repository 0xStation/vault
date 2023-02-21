export const isValidUrl = (url: string) => {
  let givenURL
  try {
    givenURL = new URL(url)
  } catch (error) {
    return false
  }
  return givenURL.protocol === "https:"
}
