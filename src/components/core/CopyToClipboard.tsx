import { useState } from "react";
import {
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export const CopyToClipboard = ({
  className = "",
  text,
  children,
}: {
  className?: string;
  text: string;
  children?: any;
}) => {
  const [isClipboardAddressCopied, setIsClipboardAddressCopied] =
    useState<boolean>(false);

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(text).then(() => {
            setIsClipboardAddressCopied(true);
            setTimeout(() => setIsClipboardAddressCopied(false), 3000);
          });
        }}
      >
        {children}
        {isClipboardAddressCopied ? (
          <>
            <ClipboardDocumentCheckIcon className="h-4 w-4 cursor-pointer" />
          </>
        ) : (
          <ClipboardIcon className="hover:text-marble-white h-4 w-4 cursor-pointer" />
        )}
      </button>
    </div>
  );
};

export default CopyToClipboard;
