import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const timeSince = (date: Date) => {
  const now = new Date()
  const dateObject = new Date(date)
  const secondsPast = (now.getTime() - dateObject.getTime()) / 1000
  if (secondsPast < 60) {
    return (secondsPast | 0) + "s"
  }
  if (secondsPast < 3600) {
    return ((secondsPast / 60) | 0) + "m"
  }
  if (secondsPast <= 86400) {
    return ((secondsPast / 3600) | 0) + "h"
  }
  if (secondsPast > 86400) {
    const day = dateObject.getDate()
    const month = dateObject.toDateString().split(" ")[1]
    const year =
      dateObject.getFullYear() === now.getFullYear()
        ? ""
        : dateObject.getFullYear()
    return day + " " + month + " " + year
  }
}

export const truncateString = (
  inputString = "",
  numberOfLettersOnEachSide = 3,
) => {
  if (numberOfLettersOnEachSide > 10) {
    numberOfLettersOnEachSide = 3
  }
  if (inputString.length > 20) {
    return (
      inputString.substr(0, 2 + numberOfLettersOnEachSide) +
      "..." +
      inputString.substr(
        inputString.length - numberOfLettersOnEachSide,
        inputString.length,
      )
    )
  }
  return inputString
}

export default truncateString
