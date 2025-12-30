"use client";
import { useEffect } from "react";
import Nprogress from "nprogress";
import { usePathname } from "next/navigation";
import "nprogress/nprogress.css";
import "../../src/app/globals.css"

const NprogressBar = () => {
  const pathName = usePathname();

  useEffect(() => {
    Nprogress.start();
    Nprogress.done();
  }, [pathName]);

  return null;
};

export default NprogressBar;
