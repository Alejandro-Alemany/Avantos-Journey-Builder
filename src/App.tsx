import { useMemo, useState } from "react";
import "./App.css";
import { AppHeader } from "./components/AppHeader";
import { ErrorState } from "./components/ErrorState";
import { FormDetail } from "./components/FormDetail";
import { FormList } from "./components/FormList";
import { LoadingState } from "./components/LoadingState";
import { useGraph } from "./hooks/useGraph";
import { sortNodesByPosition } from "./lib/graph";
import type { PrefillMappingsByNode, PrefillSourceOption } from "./types/graph";

function App() {
  const graphState = useGraph();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mappings, setMappings] = useState<PrefillMappingsByNode>({});

  const selectedNode = useMemo(() => {
    if (!graphState.data) {
      return null;
    }

    const nodes = sortNodesByPosition(graphState.data.nodes);
    const fallbackNode = nodes[nodes.length - 1] ?? null;
    return graphState.data.nodes.find((node) => node.id === selectedNodeId) ?? fallbackNode;
  }, [graphState.data, selectedNodeId]);

  const mappingCount = Object.values(mappings).reduce(
    (count, formMappings) => count + Object.values(formMappings).filter(Boolean).length,
    0,
  );

  if (graphState.loading) {
    return <LoadingState />;
  }

  if (graphState.error) {
    return <ErrorState message={graphState.error.message} />;
  }

  if (!selectedNode) {
    return <ErrorState message="The graph did not include any form nodes." />;
  }

  const selectedMappings = mappings[selectedNode.id] ?? {};

  function setFieldMapping(fieldKey: string, source: PrefillSourceOption): void {
    if (!selectedNode) {
      return;
    }

    setMappings((current) => ({
      ...current,
      [selectedNode.id]: {
        ...(current[selectedNode.id] ?? {}),
        [fieldKey]: { source },
      },
    }));
  }

  function clearFieldMapping(fieldKey: string): void {
    if (!selectedNode) {
      return;
    }

    setMappings((current) => ({
      ...current,
      [selectedNode.id]: {
        ...(current[selectedNode.id] ?? {}),
        [fieldKey]: undefined,
      },
    }));
  }

  return (
    <div className="app-shell">
      <AppHeader graphName={graphState.data.name} mappingCount={mappingCount} />

      <div className="workspace">
        <FormList
          graph={graphState.data}
          mappings={mappings}
          onSelect={setSelectedNodeId}
          selectedNodeId={selectedNode.id}
        />
        <FormDetail
          graph={graphState.data}
          mappings={selectedMappings}
          onClear={clearFieldMapping}
          onMap={setFieldMapping}
          selectedNode={selectedNode}
        />
      </div>
    </div>
  );
}

export default App;
