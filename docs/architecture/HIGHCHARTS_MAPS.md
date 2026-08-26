# Highcharts Maps boundary

The Global Operational View uses the official `highcharts` and `@highcharts/react` packages. The approved world TopoJSON is stored locally at `public/world.topo.json`, so ordinary local review does not depend on a remote map request. Country data joins to the topology with ISO Alpha-3 codes through `joinBy: ['iso-a3', 'countryCode']`.

Highcharts Maps owns geographic geometry, choropleth rendering, clustered event points, corridor lines, map navigation, labels, accessibility metadata, and map tooltips. The surrounding interface remains composed from the existing shadcn components and Didehban tokens. The map/list views and detail Sheet share React selection state; Highcharts does not own product routing or data access.

Country, event, and corridor values are deterministic local prototype fixtures. They are not live or verified intelligence. Visualization and risk variables remain provisional where already identified in `VISUALIZATION_SEMANTICS.md`.

Highcharts licensing must be validated before any commercial or production release. This repository does not contain a license key and does not suppress required credits. The current use is limited to local evaluation and MVP prototyping.
