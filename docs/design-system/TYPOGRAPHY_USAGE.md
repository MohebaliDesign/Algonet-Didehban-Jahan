# Product typography usage

## Decision

Product screens use the supplied **Vazir FD-WOL** family for Persian, **Inter** for English, and Inter with explicit LTR isolation for technical strings. The semantic implementation lives in `src/styles/typography.css`; feature components should not create new raw font sizes.

The exported source retains its 48px Heading 1 value. Didehban Jahan has an explicit product-level maximum of **40px**, so the source is preserved while the `Display` product role maps to 40px.

## Semantic roles

| Role          | Size |                Line height |  Weight | Typical use                                                   |
| ------------- | ---: | -------------------------: | ------: | ------------------------------------------------------------- |
| Display       | 40px | 1.5 Persian / 1.35 English |     700 | Exceptional diagnostic or display heading only                |
| Page title    | 30px |                  1.5 / 1.4 |     700 | Route title                                                   |
| Section title | 24px |                  1.5 / 1.4 |     600 | Inspector and major report sections                           |
| Widget title  | 18px |                  1.5 / 1.4 |     600 | Module, card, and analytical headings                         |
| Body large    | 18px |                 1.7 / 1.55 |     400 | Introductory or high-priority analysis                        |
| Body          | 16px |                 1.65 / 1.5 |     400 | Normal paragraphs and report text                             |
| Body compact  | 14px |                1.55 / 1.45 |     400 | Dense supporting content                                      |
| Control label | 14px |                       1.45 |     500 | Buttons, navigation, inputs, selects, and tabs                |
| Table text    | 14px |                       1.55 | 400–500 | Table headers and cells                                       |
| Caption       | 14px |                        1.5 | 400–500 | Badges, labels, legends, and short descriptions               |
| Metadata      | 12px |                        1.5 | 400–500 | Secondary timestamps and compact provenance only              |
| Technical     | 12px |                        1.5 | 400–600 | IDs, coordinates, tickers, versions, URLs, and UTC timestamps |

No visible text may be smaller than 12px. Normal paragraphs, controls, navigation, tables, reports, and important analytical metadata must not use the 12px metadata role.

## Direction and fonts

- Root `fa-IR` uses Vazir FD-WOL and RTL.
- Root `en` uses Inter and LTR.
- `code`, `kbd`, LTR timestamps, `.technical-text`, `[data-technical='true']`, and explicit `dir="ltr"` fragments inside RTL layouts use Inter with Unicode isolation.
- Use semantic HTML and explicit direction for technical strings; visual appearance is not a reliable direction detector.
- The supplied archive does not contain a DemiBold file. Existing 600 use maps to the supplied Vazir Medium file; no synthetic weight is enabled.

## Accessibility and layout rules

- Interactive controls have a minimum 40px visual/clickable dimension; navigation, table rows, and major tabs are larger where needed.
- Persian text wraps instead of shrinking. Dense tables use intentional horizontal scrolling when columns cannot reflow.
- Meaningful one-line truncation must expose the full value through a `title` or an equivalent accessible detail surface.
- Zoom may stack, scroll, or move filters into the existing compact panel; text must not overlap or disappear.

## Exceptions

There are no visible typography exceptions below 12px and no `font-size: 0` implementation exception. Non-text geometry such as map dots and status indicators can remain smaller because it is paired with readable text and accessible labels.
