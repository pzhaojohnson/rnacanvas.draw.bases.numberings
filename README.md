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
var b = Nucleobase.create('G');

// a numbering of 100 for the base
var n = Numbering.numbering(b, 100);

n.owner === b; // true

n.textContent; // "100"
```

### `readonly domNode`

The DOM node corresponding to the numbering
(an SVG text element).

```javascript
var n = [...app.drawing.numberings][0];

n.domNode instanceof SVGTextElement; // true

app.drawing.domNode.contains(n.domNode); // true
```

### `readonly owner`

The base that the numbering belongs to.

```javascript
var b = Nucleobase.create('A');

var n = Numbering.numbering(b, 5);

n.owner === b; // true
```

### `textContent`

The text content of the numbering.

(Is expected to be the string of a number.)

```javascript
var b = Nucleobase.create('C');

var n = Numbering.numbering(b, 52);

n.textContent; // "52"
```
