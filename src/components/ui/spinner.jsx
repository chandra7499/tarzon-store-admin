import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import clsx from "clsx";

function Spinner({ className, show, ...props }) {
  return (
    show && (
      <Loader2Icon
        role="status"
        aria-label="Loading"
        className={cn(clsx(`size-4 animate-spin`), className)}
        {...props}
      />
    )
  );
}

export { Spinner };
