import type { ActionBlueprintGraph } from "../types/graph";

const baseFields = {
  email: {
    avantos_type: "short-text",
    format: "email",
    title: "Email",
    type: "string",
  },
  name: {
    avantos_type: "short-text",
    title: "Name",
    type: "string",
  },
  notes: {
    avantos_type: "multi-line-text",
    title: "Notes",
    type: "string",
  },
};

const uiSchema = {
  type: "VerticalLayout",
  elements: [
    { type: "Control", scope: "#/properties/name", label: "Name" },
    { type: "Control", scope: "#/properties/email", label: "Email" },
    { type: "Control", scope: "#/properties/notes", label: "Notes" },
  ],
};

export const fixtureGraph: ActionBlueprintGraph = {
  id: "graph-1",
  name: "Test journey",
  nodes: [
    {
      id: "form-a",
      type: "form",
      position: { x: 0, y: 0 },
      data: {
        id: "component-a",
        component_id: "definition-a",
        component_key: "form-a",
        component_type: "form",
        input_mapping: {},
        name: "Form A",
        prerequisites: [],
      },
    },
    {
      id: "form-b",
      type: "form",
      position: { x: 1, y: 0 },
      data: {
        id: "component-b",
        component_id: "definition-b",
        component_key: "form-b",
        component_type: "form",
        input_mapping: {},
        name: "Form B",
        prerequisites: ["form-a"],
      },
    },
    {
      id: "form-c",
      type: "form",
      position: { x: 2, y: 0 },
      data: {
        id: "component-c",
        component_id: "definition-c",
        component_key: "form-c",
        component_type: "form",
        input_mapping: {},
        name: "Form C",
        prerequisites: ["form-b"],
      },
    },
  ],
  edges: [
    { source: "form-a", target: "form-b" },
    { source: "form-b", target: "form-c" },
  ],
  forms: [
    {
      id: "definition-a",
      name: "Reusable A",
      field_schema: {
        properties: baseFields,
        required: ["email"],
      },
      ui_schema: uiSchema,
    },
    {
      id: "definition-b",
      name: "Reusable B",
      field_schema: {
        properties: baseFields,
        required: ["email"],
      },
      ui_schema: uiSchema,
    },
    {
      id: "definition-c",
      name: "Reusable C",
      field_schema: {
        properties: baseFields,
        required: ["email"],
      },
      ui_schema: uiSchema,
    },
  ],
};
