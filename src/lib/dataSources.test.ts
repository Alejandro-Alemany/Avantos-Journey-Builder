import { describe, expect, it } from "vitest";
import { fixtureGraph } from "../test/fixtures";
import { getNodeById } from "./graph";
import { buildDataSourceGroups, dataSourceProviders } from "./dataSources";

describe("data source providers", () => {
  it("keeps available sources behind an extensible provider list", () => {
    expect(dataSourceProviders.map((provider) => provider.id)).toEqual(["direct", "transitive", "global"]);
  });

  it("builds direct, transitive, and global source groups for the selected form", () => {
    const selectedNode = getNodeById(fixtureGraph, "form-c");
    expect(selectedNode).toBeDefined();

    const groups = buildDataSourceGroups(fixtureGraph, selectedNode!);
    const direct = groups.find((group) => group.id === "direct");
    const transitive = groups.find((group) => group.id === "transitive");
    const global = groups.find((group) => group.id === "global");

    expect(direct?.options.map((option) => option.label)).toContain("Form B.email");
    expect(transitive?.options.map((option) => option.label)).toContain("Form A.email");
    expect(global?.options.map((option) => option.label)).toContain("Action.name");
  });
});
