import RedirectProvider from "@/providers/RedirectProvider";
import React from "react";

export default function layout({ children }) {
  return <RedirectProvider>{children}</RedirectProvider>;
}
