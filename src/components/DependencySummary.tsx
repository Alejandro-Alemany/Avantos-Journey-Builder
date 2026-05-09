import { ArrowRight, Network } from "lucide-react";
import { getAncestorIds, getDirectDependencyIds, getNodeById } from "../lib/graph";
import type { ActionBlueprintGraph, FormNode } from "../types/graph";

type DependencySummaryProps = {
  graph: ActionBlueprintGraph;
  selectedNode: FormNode;
};

export function DependencySummary({ graph, selectedNode }: DependencySummaryProps) {
  const directIds = getDirectDependencyIds(graph, selectedNode.id);
  const directSet = new Set(directIds);
  const transitiveIds = getAncestorIds(graph, selectedNode.id).filter((id) => !directSet.has(id));

  return (
    <section className="dependency-summary">
      <div className="section-title">
        <Network size={16} />
        <h2>Available upstream data</h2>
      </div>

      <div className="dependency-grid">
        <DependencyGroup graph={graph} ids={directIds} label="Direct" selectedNode={selectedNode} />
        <DependencyGroup graph={graph} ids={transitiveIds} label="Transitive" selectedNode={selectedNode} />
      </div>
    </section>
  );
}

type DependencyGroupProps = {
  graph: ActionBlueprintGraph;
  ids: string[];
  label: string;
  selectedNode: FormNode;
};

function DependencyGroup({ graph, ids, label, selectedNode }: DependencyGroupProps) {
  return (
    <div className="dependency-group">
      <span className="dependency-label">{label}</span>
      {ids.length === 0 ? (
        <p className="empty-copy">No {label.toLowerCase()} dependencies.</p>
      ) : (
        <div className="dependency-chips">
          {ids.map((nodeId) => {
            const node = getNodeById(graph, nodeId);
            return (
              <span className="dependency-chip" key={nodeId}>
                {node?.data.name ?? nodeId}
                <ArrowRight size={13} />
                {selectedNode.data.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
