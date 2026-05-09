import { Database, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { DataSourceGroup, FormField, PrefillSourceOption } from "../types/graph";

type SourcePickerProps = {
  field: FormField;
  groups: DataSourceGroup[];
  onClose: () => void;
  onSelect: (source: PrefillSourceOption) => void;
};

export function SourcePicker({ field, groups, onClose, onSelect }: SourcePickerProps) {
  const [query, setQuery] = useState("");
  const visibleGroups = useMemo(() => filterGroups(groups, query), [groups, query]);

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div className="source-modal">
        <header className="modal-header">
          <div>
            <span className="modal-kicker">Choose source</span>
            <h2>{field.label}</h2>
          </div>
          <button aria-label="Close source picker" className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </header>

        <label className="search-box">
          <Search size={16} />
          <input
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter sources"
            value={query}
          />
        </label>

        <div className="source-groups">
          {visibleGroups.map((group) => (
            <section className="source-group" key={group.id}>
              <div className="source-group-heading">
                <div>
                  <h3>{group.label}</h3>
                  <p>{group.description}</p>
                </div>
                <span>{group.options.length}</span>
              </div>

              {group.options.length === 0 ? (
                <p className="empty-copy">No sources in this group.</p>
              ) : (
                <div className="source-options">
                  {group.options.map((source) => (
                    <button className="source-option" key={source.id} onClick={() => onSelect(source)} type="button">
                      <Database size={16} />
                      <span>
                        <strong>{source.label}</strong>
                        <small>{source.detail}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function filterGroups(groups: DataSourceGroup[], query: string): DataSourceGroup[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return groups;
  }

  return groups.map((group) => ({
    ...group,
    options: group.options.filter((option) =>
      [option.label, option.fieldLabel, option.sourceName, option.valuePath].some((value) =>
        value.toLowerCase().includes(cleanQuery),
      ),
    ),
  }));
}
