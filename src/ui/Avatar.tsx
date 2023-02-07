import Image from "next/image";

interface AvatarProps {
  size?: "sm" | "md" | "lg";
  pfpUrl: string;
  className?: string;
}

const heightWidthMap: { [key: string]: number } = {
  ["sm"]: 24,
  ["md"]: 42,
  ["lg"]: 60,
};

export const Avatar = ({ size = "md", pfpUrl, className }: AvatarProps) => {
  return (
    <Image
      src={pfpUrl}
      alt="Account profile picture. If no profile picture is set, there is a linear gradient."
      height={heightWidthMap[size]}
      width={heightWidthMap[size]}
      className={`rounded-full ${className}`}
    />
  );
};
