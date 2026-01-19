import type { Nucleobase } from './Nucleobase';

import type { Numbering } from './Numbering';

import { assignUUID } from '@rnacanvas/draw.svg';

import { distance, direction } from '@rnacanvas/points';

import { Box } from '@rnacanvas/boxes';

import { VersionlessNumberingLine } from './VersionlessNumberingLine';

import { isNumber } from '@rnacanvas/value-check';

/**
 * A line connecting a numbering to its owner base.
 */
export class NumberingLine<B extends Nucleobase> {
  static defaultValues = {
    attributes: {
      'stroke': '#808080',
      'stroke-width': '1',
      'stroke-opacity': '1',
    },
    basePadding: 5,
    textPadding: 1,
  };

  /**
   * Creates and returns a new numbering line
   * connecting the given numbering to its owner base.
   */
  static connecting<B extends Nucleobase>(n: Numbering<B>): NumberingLine<B> {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    assignUUID(domNode);

    domNode.setAttribute('x1', `${n.owner.centerPoint.x}`);
    domNode.setAttribute('y1', `${n.owner.centerPoint.y}`);
    domNode.setAttribute('x2', `${n.centerPoint.x}`);
    domNode.setAttribute('y2', `${n.centerPoint.y}`);

    let line = new NumberingLine(domNode, n);

    line.set(NumberingLine.defaultValues);

    return line;
  }

  /**
   * Creates and returns a new numbering line
   * for the given numbering
   * with zero base padding and zero text padding.
   */
  static unpadded<B extends Nucleobase>(n: Numbering<B>): NumberingLine<B> {
    let line = NumberingLine.connecting(n);

    line.basePadding = 0;
    line.textPadding = 0;

    return line;
  }

  constructor(readonly domNode: SVGLineElement, readonly owner: Numbering<B>) {
    if (!domNode.dataset.basePadding) {
      domNode.dataset.basePadding = `${distance(owner.owner.centerPoint, this.point1)}`;
    }

    let ownerBBox = Box.matching(owner.domNode.getBBox());

    if (!domNode.dataset.textPadding) {
      domNode.dataset.textPadding = `${distance(this.point2, ownerBBox.peripheralPoint(owner.displacement.direction + Math.PI))}`;
    }

    owner.centerPoint.addEventListener('move', () => this.#reposition());

    owner.owner.centerPoint.addEventListener('move', () => this.#reposition());
  }

  get id() {
    return this.domNode.id;
  }

  hasAttribute(name: string): boolean {
    return this.domNode.hasAttribute(name);
  }

  getAttribute(name: string) {
    return this.domNode.getAttribute(name);
  }

  setAttribute(name: string, value: string): void {
    this.domNode.setAttribute(name, value);
  }

  setAttributes(attributes: { [name: string]: string }) {
    Object.entries(attributes).forEach(([name, value]) => this.setAttribute(name, value));
  }

  removeAttribute(name: string): void {
    this.domNode.removeAttribute(name);
  }

  get x1(): number {
    return this.domNode.x1.baseVal.value;
  }

  get y1(): number {
    return this.domNode.y1.baseVal.value;
  }

  /**
   * The end point of the line that connects with the owner base of the numbering.
   */
  get point1(): Point {
    return { x: this.x1, y: this.y1 };
  }

  get x2(): number {
    return this.domNode.x2.baseVal.value;
  }

  get y2(): number {
    return this.domNode.y2.baseVal.value;
  }

  /**
   * The end point of the line that connects with the numbering.
   */
  get point2(): Point {
    return { x: this.x2, y: this.y2 };
  }

  get length(): number {
    return distance(this.point1, this.point2);
  }

  set length(length) {
    let ownerBBox = Box.matching(this.owner.domNode.getBBox());

    this.owner.displacement.magnitude = (
      this.basePadding
      + length
      + this.textPadding
      + distance(this.owner.centerPoint, ownerBBox.peripheralPoint(this.owner.displacement.direction + Math.PI))
    );
  }

  /**
   * The angle (in radians) that is the direction of the numbering line
   * (from point 1 to point 2).
   */
  get direction(): number {
    return direction(this.point1, this.point2);
  }

  set direction(direction) {
    // cache length
    let length = this.length;

    this.owner.displacement.direction = direction;

    // maintain the length of the numbering line
    this.length = length;
  }

  get basePadding(): number {
    return this.#basePadding;
  }

  set basePadding(basePadding) {
    this.#basePadding = basePadding;
  }

  get textPadding(): number {
    return this.#textPadding;
  }

  set textPadding(textPadding) {
    this.#textPadding = textPadding;
  }

  get #basePadding(): number {
    if (!this.domNode.dataset.basePadding) {
      return 0;
    }

    let basePadding = Number.parseFloat(this.domNode.dataset.basePadding);

    if (!Number.isFinite(basePadding)) {
      return 0;
    }

    return basePadding;
  }

  set #basePadding(basePadding) {
    this.domNode.dataset.basePadding = `${basePadding}`;

    this.#reposition();
  }

  get #textPadding(): number {
    if (!this.domNode.dataset.textPadding) {
      return 0;
    }

    let textPadding = Number.parseFloat(this.domNode.dataset.textPadding);

    if (!Number.isFinite(textPadding)) {
      return 0;
    }

    return textPadding;
  }

  set #textPadding(textPadding) {
    this.domNode.dataset.textPadding = `${textPadding}`;

    this.#reposition();
  }

  set(values: Partial<NumberingLineValues>): void {
    values.attributes ? this.setAttributes(values.attributes) : {};

    isNumber(values.basePadding) ? this.basePadding = values.basePadding : {};
    isNumber(values.textPadding) ? this.textPadding = values.textPadding : {};
  }

  #reposition() {
    let d = this.owner.displacement.direction;

    this.domNode.setAttribute('x1', `${this.owner.owner.centerPoint.x + (this.#basePadding * Math.cos(d))}`);
    this.domNode.setAttribute('y1', `${this.owner.owner.centerPoint.y + (this.#basePadding * Math.sin(d))}`);

    let peripheralPoint = Box.matching(this.owner.domNode.getBBox()).peripheralPoint(d + Math.PI);

    this.domNode.setAttribute('x2', `${peripheralPoint.x + (this.#textPadding * Math.cos(d + Math.PI))}`);
    this.domNode.setAttribute('y2', `${peripheralPoint.y + (this.#textPadding * Math.sin(d + Math.PI))}`);
  }

  /**
   * Returns the serialized form of the numbering line.
   */
  serialized() {
    return {
      id: this.id,
      ownerID: this.owner.id,

      // directly save paddings (since recalculating them on deserialization is somewhat imprecise)
      basePadding: this.basePadding,
      textPadding: this.textPadding,
    };
  }

  /**
   * Deserializes the saved numbering line.
   *
   * Throws if unable to do so.
   *
   * @param savedNumberingLine The serialized form of the saved numbering line.
   * @param parentDrawing The drawing that the saved numbering line is in.
   */
  static deserialized<B extends Nucleobase>(savedNumberingLine: unknown, parentDrawing: Drawing<B>): NumberingLine<B> {
    let oldNumberingLine = new VersionlessNumberingLine(savedNumberingLine);

    let domNode = parentDrawing.domNode.querySelector('#' + oldNumberingLine.id);
    if (!domNode) { throw new Error('Numbering line DOM node not found.'); }
    if (!(domNode instanceof SVGLineElement)) { throw new Error('Numbering line DOM node must be an SVG line element.'); }

    let owner = parentDrawing.numberings.find(bn => bn.id === oldNumberingLine.ownerID);
    if (!owner) { throw new Error('Numbering line owner not found.'); }

    let newNumberingLine = new NumberingLine(domNode, owner);

    if (isNumber(oldNumberingLine.basePadding)) { newNumberingLine.basePadding = oldNumberingLine.basePadding; }
    if (isNumber(oldNumberingLine.textPadding)) { newNumberingLine.textPadding = oldNumberingLine.textPadding; }

    return newNumberingLine;
  }
}

type NumberingLineValues = {
  attributes: { [name: string]: string },
  basePadding: number;
  textPadding: number;
};

/**
 * The drawing interface used by numbering lines.
 */
interface Drawing<B extends Nucleobase> {
  /**
   * The DOM node corresponding to the drawing.
   */
  domNode: SVGSVGElement;

  /**
   * All numberings in the drawing.
   *
   * Is required to be an array to improve performance
   * (as opposed to allowing this to be any form of iterable).
   */
  numberings: Numbering<B>[];
}

type Point = {
  x: number;
  y: number;
};
