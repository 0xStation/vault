import { RawCall } from "lib/transactions/call"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import {
  addOwnerWithThreshold,
  changeThreshold,
  removeOwner,
  swapOwner,
} from "../fragments"
import { encodeFunctionData } from "../utils"

/**
 * Change threshold
 * @param safeAddress address of Safe contract
 * @param threshold quorum for the Safe
 * @returns RawCall representation
 */
export const prepareChangeThresholdCall = (
  safeAddress: string,
  threshold: number,
): RawCall => {
  return {
    to: toChecksumAddress(safeAddress),
    value: "0",
    data: encodeFunctionData(changeThreshold, [threshold]),
    operation: 0, // no delegate call
  }
}

/**
 * Add owner with threshold
 * @param safeAddress address of Safe contract
 * @param newOwner new owner to be added to the Safe
 * @param threshold quorum for the Safe
 * @returns RawCall representation
 */
export const prepareAddOwnerWithThresholdCall = (
  safeAddress: string,
  newOwner: string,
  threshold: number,
): RawCall => {
  return {
    to: toChecksumAddress(safeAddress),
    value: "0",
    data: encodeFunctionData(addOwnerWithThreshold, [newOwner, threshold]),
    operation: 0, // no delegate call
  }
}

/**
 * Add owner with threshold
 * @param safeAddress address of Safe contract
 * @param prevOwner Owner that pointed to the owner to be removed in the linked list
 * @param owner Owner address to be removed.
 * @param threshold New threshold.
 * @returns RawCall representation
 */
export const prepareRemoveOwnerCall = (
  safeAddress: string,
  prevOwner: string,
  owner: string,
  threshold: number,
): RawCall => {
  return {
    to: toChecksumAddress(safeAddress),
    value: "0",
    data: encodeFunctionData(removeOwner, [prevOwner, owner, threshold]),
    operation: 0, // no delegate call
  }
}

/**
 * Swap owner
 * @param safeAddress address of Safe contract
 * @param prevOwner Owner that pointed to the owner to be replaced in the linked list
 * @param oldOwner Owner address to be replaced.
 * @param newOwner New owner address.
 * @returns RawCall representation
 */
export const prepareSwapOwnerCall = (
  safeAddress: string,
  prevOwner: string,
  oldOwner: string,
  newOwner: string,
): RawCall => {
  return {
    to: toChecksumAddress(safeAddress),
    value: "0",
    data: encodeFunctionData(swapOwner, [prevOwner, oldOwner, newOwner]),
    operation: 0, // no delegate call
  }
}
