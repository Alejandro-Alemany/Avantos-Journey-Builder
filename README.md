# Avantos Journey Builder

React implementation of the Journey Builder coding challenge. The app reads the action blueprint graph from the provided mock server, lists the forms in dependency order, and lets a user configure prefill mappings for each form field.

## Features

- Fetches the challenge graph from the mock API.
- Shows every form in the journey with field, parent, and mapped counts.
- Defaults to the final form so the most dependency-rich case is visible immediately.
- Separates direct dependencies, transitive dependencies, and global data sources.
- Lets users map and clear individual field prefill sources.
- Keeps data source discovery behind a provider list so the UI does not need new branches for each source type.

## Running Locally

Start the challenge mock server first:

```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver
npm install
npm start
```

Then run this app in a second terminal:

```bash
npm install
npm run dev
```

By default, the app reads:

```text
http://localhost:3000/api/v1/demo/actions/blueprints/demo/graph
```

To point the app at another graph endpoint:

```bash
VITE_GRAPH_URL=http://localhost:3000/api/v1/example/actions/blueprints/example/graph npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run build
```

## Implementation Notes

The graph-specific logic lives in `src/lib/graph.ts`. It keeps traversal and field extraction separate from React components, which makes the dependency rules testable and easier to reuse.

The source discovery logic lives in `src/lib/dataSources.ts`. Each provider has an `id`, `label`, `description`, and `resolve` function. The picker renders provider output generically, so new source categories can be added without changing the modal or field table components.

Mappings are currently held in React state because the challenge focuses on the view/edit workflow and the mock server does not expose a persistence endpoint.
