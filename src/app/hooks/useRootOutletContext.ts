import { useOutletContext } from "react-router-dom";

import type { RootOutletContext } from "../types/rootContext";

export function useRootOutletContext() {
  return useOutletContext<RootOutletContext>();
}
