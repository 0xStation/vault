import { conductorDomain, EIP712Message } from "./utils"

/**
 * Hash a payload of data to update a terminal provided its values using EIP712.
 * Intended use when updating a terminal's data by signing it's metadata
 * @param args
 * @returns updateTerminalHash
 */
export const formatUpdateTerminalValues = ({
  name,
  description,
  url,
}: {
  name: string
  description: string
  url: string
}) => {
  const message: EIP712Message = {
    domain: conductorDomain(),
    types: {
      Action: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "url", type: "string" },
      ],
    },
    value: {
      name,
      description,
      url,
    },
  }

  return message
}
