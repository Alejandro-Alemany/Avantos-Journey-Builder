import { CirclePlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { buildDataSourceGroups } from "../lib/dataSources";
import { getFieldsForNode } from "../lib/graph";
import type {
  ActionBlueprintGraph,
  FormMappings,
  FormNode,
  PrefillSourceOption,
} from "../types/graph";
import { SourcePicker } from "./SourcePicker";

type PrefillEditorProps = {
  graph: ActionBlueprintGraph;
  mappings: FormMappings;
  onClear: (fieldKey: string) => void;
  onMap: (fieldKey: string, source: PrefillSourceOption) => void;
  selectedNode: FormNode;
};

export function PrefillEditor({ graph, mappings, onClear, onMap, selectedNode }: PrefillEditorProps) {
  const fields = getFieldsForNode(graph, selectedNode);
  const groups = useMemo(() => buildDataSourceGroups(graph, selectedNode), [graph, selectedNode]);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const activeField = fields.find((field) => field.key === activeFieldKey);

  return (
    <section className="prefill-editor">
      <div className="section-title">
        <CirclePlus size={16} />
        <h2>Prefill mapping</h2>
      </div>

      <div className="field-table">
        <div className="field-table-header">
          <span>Field</span>
          <span>Prefill source</span>
          <span>Action</span>
        </div>

        {fields.map((field) => {
          const mapping = mappings[field.key];
          return (
            <div className="field-row" key={field.key}>
              <button className="field-cell" onClick={() => setActiveFieldKey(field.key)} type="button">
                <strong>{field.label}</strong>
                <small>
                  {field.key} · {field.schema.avantos_type ?? field.schema.type ?? "field"}
                  {field.required ? " · required" : ""}
                </small>
              </button>

              <button className="source-cell" onClick={() => setActiveFieldKey(field.key)} type="button">
                {mapping ? (
                  <>
                    <strong>{mapping.source.label}</strong>
                    <small>{mapping.source.detail}</small>
                  </>
                ) : (
                  <>
                    <strong>Not configured</strong>
                    <small>Click to choose a source</small>
                  </>
                )}
              </button>

              <div className="action-cell">
                {mapping ? (
                  <button aria-label={`Clear ${field.label} mapping`} className="icon-button" onClick={() => onClear(field.key)} type="button">
                    <X size={16} />
                  </button>
                ) : (
                  <button className="small-button" onClick={() => setActiveFieldKey(field.key)} type="button">
                    Map
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeField ? (
        <SourcePicker
          field={activeField}
          groups={groups}
          onClose={() => setActiveFieldKey(null)}
          onSelect={(source) => {
            onMap(activeField.key, source);
            setActiveFieldKey(null);
          }}
        />
      ) : null}
    </section>
  );
}
