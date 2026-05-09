export type JsonSchemaProperty = {
  avantos_type?: string;
  enum?: unknown;
  format?: string;
  items?: unknown;
  title?: string;
  type?: string;
  uniqueItems?: boolean;
};

export type UiSchemaElement = {
  label?: string;
  scope?: string;
  type: string;
};

export type FormDefinition = {
  id: string;
  name: string;
  description?: string;
  field_schema: {
    properties: Record<string, JsonSchemaProperty>;
    required?: string[];
  };
  ui_schema?: {
    elements?: UiSchemaElement[];
  };
};

export type FormNode = {
  id: string;
  type: "form";
  position: {
    x: number;
    y: number;
  };
  data: {
    id: string;
    component_id: string;
    component_key: string;
    component_type: string;
    input_mapping?: Record<string, unknown>;
    name: string;
    prerequisites: string[];
  };
};

export type GraphEdge = {
  source: string;
  target: string;
};

export type ActionBlueprintGraph = {
  id: string;
  name: string;
  description?: string;
  nodes: FormNode[];
  edges: GraphEdge[];
  forms: FormDefinition[];
};

export type FormField = {
  key: string;
  label: string;
  required: boolean;
  schema: JsonSchemaProperty;
};

export type SourceKind = string;

export type PrefillSourceOption = {
  detail: string;
  id: string;
  fieldKey: string;
  fieldLabel: string;
  formNodeId?: string;
  formName?: string;
  kind: SourceKind;
  label: string;
  sourceName: string;
  valuePath: string;
};

export type DataSourceGroup = {
  description: string;
  id: string;
  label: string;
  options: PrefillSourceOption[];
};

export type PrefillMapping = {
  source: PrefillSourceOption;
};

export type FormMappings = Record<string, PrefillMapping | undefined>;
export type PrefillMappingsByNode = Record<string, FormMappings>;
