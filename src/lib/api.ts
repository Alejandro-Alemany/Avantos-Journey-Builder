import type { ActionBlueprintGraph } from "../types/graph";

const DEFAULT_API_URL = "http://localhost:3000/api/v1/demo/actions/blueprints/demo/graph";

export async function fetchActionBlueprintGraph(): Promise<ActionBlueprintGraph> {
  const url = import.meta.env.VITE_GRAPH_URL || DEFAULT_API_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Graph request failed with ${response.status}`);
  }

  return response.json() as Promise<ActionBlueprintGraph>;
}
