# Installation

With `npm`:

```
npm install @rnacanvas/draw.bases.numberings
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// example imports
import { Numbering, NumberingLine } from '@rnacanvas/draw.bases.numberings';
```

## `class Numbering`

A numbering for a [base](https://pzhaojohnson.github.io/rnacanvas.draw.bases/).

```javascript
// a nucleobase
b instanceof Nucleobase; // true

// a numbering of 100 for the base
var n = Numbering.numbering(b, 100);
```

### `readonly domNode`

The DOM node corresponding to the numbering
(an SVG text element).

```javascript
n.domNode instanceof SVGTextElement; // true
```
