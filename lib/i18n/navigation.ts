import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. Link and useRouter here keep the visitor in the
 * locale they are already reading, so an English visitor clicking through to a
 * case study stays in English instead of silently reverting to Spanish.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
