export const getLocalDateFromDateString = (dateString: string) => {
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
  } as Intl.DateTimeFormatOptions
  const date = new Date(dateString)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toLocaleDateString(undefined, options)
}
