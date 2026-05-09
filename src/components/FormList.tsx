import { ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { getDependencyDepth, getDirectDependencyIds, getFieldsForNode, sortNodesByPosition } from "../lib/graph";
import type { ActionBlueprintGraph, FormNode, PrefillMappingsByNode } from "../types/graph";

type FormListProps = {
  graph: ActionBlueprintGraph;
  mappings: PrefillMappingsByNode;
  onSelect: (nodeId: string) => void;
  selectedNodeId: string;
};

export function FormList({ graph, mappings, onSelect, selectedNodeId }: FormListProps) {
  const nodes = sortNodesByPosition(graph.nodes);

  return (
    <aside className="form-list" aria-label="Forms">
      <div className="panel-heading">
        <span>Forms</span>
        <strong>{nodes.length}</strong>
      </div>

      <div className="form-list-items">
        {nodes.map((node) => (
          <FormListItem
            key={node.id}
            graph={graph}
            mappings={mappings}
            node={node}
            onSelect={onSelect}
            selected={node.id === selectedNodeId}
          />
        ))}
      </div>
    </aside>
  );
}

type FormListItemProps = {
  graph: ActionBlueprintGraph;
  mappings: PrefillMappingsByNode;
  node: FormNode;
  onSelect: (nodeId: string) => void;
  selected: boolean;
};

function FormListItem({ graph, mappings, node, onSelect, selected }: FormListItemProps) {
  const fieldCount = getFieldsForNode(graph, node).length;
  const dependencyCount = getDirectDependencyIds(graph, node.id).length;
  const configuredCount = Object.values(mappings[node.id] ?? {}).filter(Boolean).length;
  const depth = getDependencyDepth(graph, node.id);

  return (
    <button
      className={selected ? "form-list-item selected" : "form-list-item"}
      onClick={() => onSelect(node.id)}
      type="button"
    >
      <span className="node-depth" style={{ "--depth": depth } as CSSProperties} />
      <span className="form-list-main">
        <span className="form-name">{node.data.name}</span>
        <span className="form-meta">
          {fieldCount} fields · {dependencyCount} parents · {configuredCount} mapped
        </span>
      </span>
      <ChevronRight size={16} />
    </button>
  );
}
