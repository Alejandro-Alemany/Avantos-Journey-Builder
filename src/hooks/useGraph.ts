import { useEffect, useState } from "react";
import { fetchActionBlueprintGraph } from "../lib/api";
import type { ActionBlueprintGraph } from "../types/graph";

type GraphState =
  | { data: ActionBlueprintGraph; error: null; loading: false }
  | { data: null; error: Error; loading: false }
  | { data: null; error: null; loading: true };

export function useGraph(): GraphState {
  const [state, setState] = useState<GraphState>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    fetchActionBlueprintGraph()
      .then((data) => {
        if (active) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((error: Error) => {
        if (active) {
          setState({ data: null, error, loading: false });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
