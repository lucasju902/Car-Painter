import React from "react";
import { CustomIconButton, LinkIcon, LinkOfficon } from "./LockButton.style";

export const LockButton = ({ locked, ...props }) => {
  return (
    <CustomIconButton {...props} locked={locked}>
      {locked === "true" ? <LinkIcon /> : <LinkOfficon />}
    </CustomIconButton>
  );
};
