import type {
  ActionBlueprintGraph,
  DataSourceGroup,
  FormNode,
  PrefillSourceOption,
  SourceKind,
} from "../types/graph";
import { getAncestorIds, getDirectDependencyIds, getFieldsForNode, getNodeById } from "./graph";

type DataSourceContext = {
  graph: ActionBlueprintGraph;
  selectedNode: FormNode;
};

type DataSourceProvider = {
  description: string;
  id: SourceKind;
  label: string;
  resolve: (context: DataSourceContext) => PrefillSourceOption[];
};

function formFieldOptions(graph: ActionBlueprintGraph, nodeIds: string[], kind: SourceKind): PrefillSourceOption[] {
  return nodeIds.flatMap((nodeId) => {
    const node = getNodeById(graph, nodeId);
    if (!node) {
      return [];
    }

    return getFieldsForNode(graph, node).map((field) => ({
      detail: `${node.data.name} field`,
      id: `${kind}:${node.id}:${field.key}`,
      fieldKey: field.key,
      fieldLabel: field.label,
      formNodeId: node.id,
      formName: node.data.name,
      kind,
      label: `${node.data.name}.${field.key}`,
      sourceName: node.data.name,
      valuePath: `${node.id}.${field.key}`,
    }));
  });
}

const globalOptions: PrefillSourceOption[] = [
  {
    detail: "Action global value",
    id: "global:action.id",
    fieldKey: "id",
    fieldLabel: "Action ID",
    kind: "global",
    label: "Action.id",
    sourceName: "Action",
    valuePath: "action.id",
  },
  {
    detail: "Action global value",
    id: "global:action.name",
    fieldKey: "name",
    fieldLabel: "Action name",
    kind: "global",
    label: "Action.name",
    sourceName: "Action",
    valuePath: "action.name",
  },
  {
    detail: "Organization global value",
    id: "global:organization.id",
    fieldKey: "id",
    fieldLabel: "Organization ID",
    kind: "global",
    label: "Client Organization.id",
    sourceName: "Client Organization",
    valuePath: "organization.id",
  },
  {
    detail: "Organization global value",
    id: "global:organization.name",
    fieldKey: "name",
    fieldLabel: "Organization name",
    kind: "global",
    label: "Client Organization.name",
    sourceName: "Client Organization",
    valuePath: "organization.name",
  },
];

export const dataSourceProviders: DataSourceProvider[] = [
  {
    id: "direct",
    label: "Direct dependencies",
    description: "Fields from forms that immediately feed into the selected form.",
    resolve: ({ graph, selectedNode }) =>
      formFieldOptions(graph, getDirectDependencyIds(graph, selectedNode.id), "direct"),
  },
  {
    id: "transitive",
    label: "Transitive dependencies",
    description: "Fields from upstream forms reached by walking through earlier dependencies.",
    resolve: ({ graph, selectedNode }) => {
      const directIds = new Set(getDirectDependencyIds(graph, selectedNode.id));
      const transitiveIds = getAncestorIds(graph, selectedNode.id).filter((nodeId) => !directIds.has(nodeId));
      return formFieldOptions(graph, transitiveIds, "transitive");
    },
  },
  {
    id: "global",
    label: "Global data",
    description: "Static global values available to every form in the journey.",
    resolve: () => globalOptions,
  },
];

export function buildDataSourceGroups(graph: ActionBlueprintGraph, selectedNode: FormNode): DataSourceGroup[] {
  return dataSourceProviders.map((provider) => ({
    description: provider.description,
    id: provider.id,
    label: provider.label,
    options: provider.resolve({ graph, selectedNode }),
  }));
}
