import { useAccount, useEnsName } from "wagmi";
import truncateString from "../../lib/utils";
import { CopyToClipboard } from "./CopyToClipboard";

export function Account() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <div className="flex flex-row">
      <p className="mr-1">
        {ensName ?? truncateString(address)}
        {ensName ? ` (${truncateString(address)})` : null}
      </p>
      <CopyToClipboard text={address as string} />
    </div>
  );
}
