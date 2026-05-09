import { GitBranch, RefreshCcw } from "lucide-react";

type AppHeaderProps = {
  graphName: string;
  mappingCount: number;
};

export function AppHeader({ graphName, mappingCount }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">
          <GitBranch size={18} />
        </div>
        <div>
          <h1>Journey Builder</h1>
          <p>{graphName}</p>
        </div>
      </div>

      <div className="header-actions">
        <span className="status-pill">
          <RefreshCcw size={14} />
          {mappingCount} configured
        </span>
      </div>
    </header>
  );
}
