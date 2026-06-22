import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Link/router cientes do locale (preservam o prefixo /pt-br, /es, etc.). */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
