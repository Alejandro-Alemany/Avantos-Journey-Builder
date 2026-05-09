import type {
  ActionBlueprintGraph,
  FormDefinition,
  FormField,
  FormNode,
} from "../types/graph";

function fieldKeyFromScope(scope: string | undefined): string | null {
  if (!scope) {
    return null;
  }

  const marker = "#/properties/";
  if (!scope.startsWith(marker)) {
    return null;
  }

  return scope.slice(marker.length);
}

export function sortNodesByPosition(nodes: FormNode[]): FormNode[] {
  return [...nodes].sort((left, right) => {
    if (left.position.x !== right.position.x) {
      return left.position.x - right.position.x;
    }

    return left.position.y - right.position.y;
  });
}

export function getFormDefinition(graph: ActionBlueprintGraph, node: FormNode): FormDefinition | undefined {
  return graph.forms.find((form) => form.id === node.data.component_id);
}

export function getFieldsForNode(graph: ActionBlueprintGraph, node: FormNode): FormField[] {
  const form = getFormDefinition(graph, node);
  if (!form) {
    return [];
  }

  const required = new Set(form.field_schema.required ?? []);
  const properties = form.field_schema.properties;
  const uiFields =
    form.ui_schema?.elements
      ?.map((element) => ({
        key: fieldKeyFromScope(element.scope),
        label: element.label,
        type: element.type,
      }))
      .filter((item) => item.type === "Control" && item.key && properties[item.key]) ?? [];

  const orderedKeys = uiFields.length > 0 ? uiFields.map((item) => item.key as string) : Object.keys(properties);
  const labelsByKey = new Map(uiFields.map((item) => [item.key, item.label]));

  return orderedKeys.map((key) => ({
    key,
    label: labelsByKey.get(key) || properties[key].title || key,
    required: required.has(key),
    schema: properties[key],
  }));
}

export function getDirectDependencyIds(graph: ActionBlueprintGraph, nodeId: string): string[] {
  const node = graph.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return [];
  }

  if (node.data.prerequisites.length > 0) {
    return [...node.data.prerequisites];
  }

  return graph.edges.filter((edge) => edge.target === nodeId).map((edge) => edge.source);
}

export function getAncestorIds(graph: ActionBlueprintGraph, nodeId: string): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  function visit(currentNodeId: string): void {
    for (const parentId of getDirectDependencyIds(graph, currentNodeId)) {
      if (seen.has(parentId)) {
        continue;
      }

      seen.add(parentId);
      ordered.push(parentId);
      visit(parentId);
    }
  }

  visit(nodeId);
  return ordered;
}

export function getNodeById(graph: ActionBlueprintGraph, nodeId: string): FormNode | undefined {
  return graph.nodes.find((node) => node.id === nodeId);
}

export function getDependencyDepth(graph: ActionBlueprintGraph, nodeId: string): number {
  const directIds = getDirectDependencyIds(graph, nodeId);
  if (directIds.length === 0) {
    return 0;
  }

  return 1 + Math.max(...directIds.map((directId) => getDependencyDepth(graph, directId)));
}
