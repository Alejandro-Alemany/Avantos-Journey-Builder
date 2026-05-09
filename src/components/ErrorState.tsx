import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="center-state">
      <AlertTriangle size={28} />
      <h1>Could not load the journey graph</h1>
      <p>{message}</p>
      <pre>cd frontendchallengeserver && npm install && npm start</pre>
    </div>
  );
}
