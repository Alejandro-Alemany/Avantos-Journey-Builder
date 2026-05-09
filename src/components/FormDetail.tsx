import { FileInput } from "lucide-react";
import { getFieldsForNode } from "../lib/graph";
import type {
  ActionBlueprintGraph,
  FormMappings,
  FormNode,
  PrefillSourceOption,
} from "../types/graph";
import { DependencySummary } from "./DependencySummary";
import { PrefillEditor } from "./PrefillEditor";

type FormDetailProps = {
  graph: ActionBlueprintGraph;
  mappings: FormMappings;
  onClear: (fieldKey: string) => void;
  onMap: (fieldKey: string, source: PrefillSourceOption) => void;
  selectedNode: FormNode;
};

export function FormDetail({ graph, mappings, onClear, onMap, selectedNode }: FormDetailProps) {
  const fields = getFieldsForNode(graph, selectedNode);
  const configuredCount = Object.values(mappings).filter(Boolean).length;

  return (
    <main className="form-detail">
      <section className="detail-hero">
        <div>
          <span className="eyebrow">Selected form</span>
          <h2>{selectedNode.data.name}</h2>
          <p>
            Configure how this form&apos;s fields are prefilled from upstream forms or global journey data.
          </p>
        </div>

        <div className="detail-stats" aria-label="Selected form stats">
          <Stat label="Fields" value={fields.length} />
          <Stat label="Prefilled" value={configuredCount} />
          <Stat label="Component" value={selectedNode.data.component_id.slice(-6).toUpperCase()} />
        </div>
      </section>

      <DependencySummary graph={graph} selectedNode={selectedNode} />
      <PrefillEditor graph={graph} mappings={mappings} onClear={onClear} onMap={onMap} selectedNode={selectedNode} />
    </main>
  );
}

type StatProps = {
  label: string;
  value: number | string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="stat">
      <FileInput size={16} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
