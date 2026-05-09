import { describe, expect, it } from "vitest";
import { fixtureGraph } from "../test/fixtures";
import { getAncestorIds, getDirectDependencyIds, getFieldsForNode, getNodeById } from "./graph";

describe("graph utilities", () => {
  it("returns direct dependencies for a form node", () => {
    expect(getDirectDependencyIds(fixtureGraph, "form-c")).toEqual(["form-b"]);
  });

  it("walks transitive ancestors in dependency order", () => {
    expect(getAncestorIds(fixtureGraph, "form-c")).toEqual(["form-b", "form-a"]);
  });

  it("extracts user-editable form fields from ui schema controls", () => {
    const node = getNodeById(fixtureGraph, "form-c");
    expect(node).toBeDefined();

    const fields = getFieldsForNode(fixtureGraph, node!);
    expect(fields.map((field) => field.key)).toEqual(["name", "email", "notes"]);
    expect(fields.find((field) => field.key === "email")?.required).toBe(true);
  });
});
