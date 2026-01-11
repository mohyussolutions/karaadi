import { IconType } from "react-icons";

export const MohyusLogoIcon: IconType = (props) => {
  const { size = 60, ...rest } = props as { size?: number | string };

  return (
    <img
      src="/logo.jpg"
      alt="Mohyus Logo"
      width={size}
      height={size}
      style={{ display: "inline-block" }}
      {...rest}
    />
  );
};
