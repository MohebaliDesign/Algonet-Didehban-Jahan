# Highcharts Maps boundary

The World Monitor and Security & Geopolitics maps use the official `highcharts` package and the Highcharts Map Collection interaction model. The approved world TopoJSON is stored locally at `public/world.topo.json`; it is the same `World, medium resolution` / Map Collection `2.3.3` topology supplied for the map redesign, so the initial world view does not depend on a remote geography request.

The shared implementation lives in `src/components/product/MapCollectionDrilldownMap.tsx`. The top-level world series is built from every geometry in the local topology and uses the collection metadata (`hc-key`, `hc-a2`, `iso-a2`, `iso-a3`, country name, and label metadata). Country fills represent the prototype tension index rather than population. Areas without a local tension fixture remain neutral/no-data instead of receiving invented intelligence values.

Country selection follows the Highcharts Map Collection Overview pattern: each world point exposes a drilldown key, the Highcharts drilldown module performs map zooming, and the component resolves the matching Map Collection country TopoJSON from the pinned `2.3.3` `map-index.json`. Country subdivision geometry is fetched only after a user drills into a country. A direct `countries/{hc-key}/{hc-key}-all.topo.json` path is retained as a fallback when index-name matching is unavailable. Maps that have no detailed collection entry remain at the world level and show a short unavailable state.

The repository currently has country-level tension fixtures but does not contain verified province/state-level tension data. To exercise the full subdivision choropleth interaction in the prototype, subdivision values are deterministic mock values derived from the selected country's prototype tension score and are explicitly labeled as prototype subdivision data in the tooltip. They must be replaced by real subnational event aggregation before production use.

Highcharts Maps owns geographic geometry, tension choropleth rendering, country/subdivision data labels, hover emphasis, map navigation, smooth map drilldown/drill-up, breadcrumbs, accessibility metadata, legend, and map tooltips. World Monitor retains a non-map list alternative for accessibility and small-screen use. Surrounding page layout, global filters, module controls, and product routing remain outside the map engine and continue to use existing shadcn components and Didehban tokens.

Typography follows the product contract: Latin/English labels use Inter and Persian interface/tooltip text uses Vazir. The map foundation and ordered tension colors use the provisional visualization tokens documented in `VISUALIZATION_SEMANTICS.md`; the world SVG reference's `0.72` border weight is retained as the baseline geographic boundary weight.

Country, event, and derived subdivision values are deterministic prototype fixtures. They are not live or verified intelligence. Visualization and risk variables remain provisional where identified in `VISUALIZATION_SEMANTICS.md`.

Highcharts licensing must be validated before any commercial or production release. This repository does not contain a license key and does not suppress required credits. The current use is limited to local evaluation and MVP prototyping.
