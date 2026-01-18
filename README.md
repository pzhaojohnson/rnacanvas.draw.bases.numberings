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

Numberings move "with" their owner bases.

```javascript
var b = Nucleobase.create('G');

// a numbering of 100 for the base
var n = Numbering.numbering(b, 100);

n.owner === b; // true

n.textContent; // "100"
```

### `static defaultValues`

Default values for numberings created using static methods such as `static numbering()`.

```javascript
// any attribute can be given a default value
Numbering.defaultValues.attributes['font-family'] = 'Arial';
Numbering.defaultValues.attributes['font-size'] = '8';
Numbering.defaultValues.attributes['font-weight'] = '400';
Numbering.defaultValues.attributes['fill'] = 'gray';

var b = Nucleobase.create('G');

var n = Numbering.numbering(b, 10);

n.getAttribute('font-family'); // "Arial"
n.getAttribute('font-size'); // "8"
n.getAttribute('font-weight'); // "400"
n.getAttribute('fill'); // "gray"
```

### `static numbering()`

Creates and returns a new numbering object
that numbers the specified base the given number.

```javascript
var b = Nucleobase.create('A');

var n = Numbering.numbering(b, 12);

n.owner === b; // true

n.textContent; // "12"
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

### `id`

The ID of the numbering.

(Corresponds to the `id` attribute of the underlying DOM node.)

<b>All numberings must have a unique ID.</b>

Otherwise RNAcanvas drawings can't be saved and undo/redo functionality won't work.

Numberings created using the `static numbering()` method are automatically given unique IDs.

```javascript
var b = Nucleobase.create('G');

var n = Numbering.numbering(b, 5);

typeof n.id; // "string"
```

As with any element,
the ID for a numbering should never be changed.

### `hasAttribute()`

Returns `true` if the DOM node corresponding to the numbering
has the specified attribute.

```javascript
var b = Nucleobase.create('A');

var n = Numbering.numbering(b, 5);

n.domNode.setAttribute('fill-opacity', '0.5');

n.hasAttribute('fill-opacity'); // true

n.domNode.removeAttribute('fill-opacity');

n.hasAttribute('fill-opacity'); // false
```

### `getAttribute()`

Returns the string value of the specified attribute.

Returns `null` if the DOM node corresponding to the numbering
does not have the specified attribute.

```javascript
var b = Nucleobase.create('U');

var n = Numbering.numbering(b, 10);

n.domNode.setAttribute('fill', 'green');

n.getAttribute('fill'); // "green"

n.domNode.removeAttribute('fill');

n.getAttribute('fill'); // null
```

### `setAttribute()`

Sets an attribute on the DOM node corresponding to the numbering.

```javascript
var b = Nucleobase.create('T');

var n = Numbering.numbering(b, 20);

n.setAttribute('font-family', 'Arial Narrow');

n.domNode.getAttribute('font-family'); // "Arial Narrow"
```

### `setAttributes()`

Set multiple attributes of the numbering at once using an object.

```javascript
var b = Nucleobase.create('G');

var n = Numbering.numbering(b, -100);

n.setAttributes({
  'font-family': 'Helvetica',
  'font-size': '12',
  'fill': 'blue',
});

n.getAttribute('font-family'); // "Helvetica"
n.getAttribute('font-size'); // "12"
n.getAttribute('fill'); // "blue"
```

### `removeAttribute()`

Removes an attribute from the DOM node corresponding to the numbering.

```javascript
var b = Nucleobase.create('A');

var n = Numbering.numbering(b, 2);

n.domNode.setAttribute('font-size', '8');

n.domNode.hasAttribute('font-size'); // true

n.removeAttribute('font-size');

n.domNode.hasAttribute('font-size'); // false
```

### `textContent`

The text content of the numbering.

(Is expected to be the string of a number,
though the text content is allowed to be anything.)

```javascript
var b = Nucleobase.create('C');

var n = Numbering.numbering(b, 52);

n.textContent; // "52"

n.textContent = '101';

n.domNode.textContent; // "101"
```

### `number`

The number that the text content of the numbering parses to.

May evaluate to `NaN` if the text content of the numbering does not parse to a number.

```javascript
var b = Nucleobase.create('A');

var n = Numbering.numbering(b, 50);

n.number; // 50

n.number = 23;

n.textContent; // "23"

n.textContent = 'asdf';

n.number; // NaN
```

### `displacement`

The displacement of the numbering relative to its owner base.

<b>The numbering must be present in the document body for displacement calculations to work.</b>

Displacement is calculated as the vector
from the center point of the owner base
to the center point of the numbering.

```javascript
var n = [...app.drawing.numberings][0];

// must be present in the document body
// (for displacement calculations to work)
document.body.contains(n.domNode); // true

// set displacement using X and Y values
n.displacement.x = 30;
n.displacement.y = 30 * 3**0.5;

n.displacement.magnitude; // 60
n.displacement.direction; // Math.PI / 3

// set displacement by magnitude and direction
n.displacement.magnitude = 50;
n.displacement.direction = Math.PI / 6;

n.displacement.x; // 25 * 3**0.5
n.displacement.y; // 25
```

### `serialized()`

Returns the serialized form of the numbering,
which contains the necessary information for recreating it.

This method is used when saving drawings, for instance.

```javascript
var b = Nucleobase.create('A');

var n = Numbering.numbering(b, 55);

var savedNumbering = n.serialized();

savedNumbering.id === n.id; // true

savedNumbering.ownerID === b.id; // true
```
