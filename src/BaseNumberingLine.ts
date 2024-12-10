import type { Nucleobase } from './Nucleobase';

import type { BaseNumbering } from './BaseNumbering';

import { assignUUID } from '@rnacanvas/draw.svg';

import { distance, direction } from '@rnacanvas/points';

import { Box } from '@rnacanvas/boxes';

import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

import { isNumber } from '@rnacanvas/value-check';

/**
 * A line to connect a base numbering to its owner base.
 */
export class BaseNumberingLine<B extends Nucleobase> {
  static defaultValues = {
    attributes: {
      'stroke': '#808080',
      'stroke-width': '1',
      'stroke-opacity': '1',
    },
    basePadding: 7,
    numberingPadding: 2,
  };

  /**
   * Creates and returns a new base numbering line
   * connecting the given base numbering to its owner base.
   */
  static connecting<B extends Nucleobase>(bn: BaseNumbering<B>): BaseNumberingLine<B> {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    assignUUID(domNode);

    domNode.setAttribute('x1', `${bn.owner.centerPoint.x}`);
    domNode.setAttribute('y1', `${bn.owner.centerPoint.y}`);
    domNode.setAttribute('x2', `${bn.centerPoint.x}`);
    domNode.setAttribute('y2', `${bn.centerPoint.y}`);

    let line = new BaseNumberingLine(domNode, bn);

    line.set(BaseNumberingLine.defaultValues);

    return line;
  }

  /**
   * Creates and returns a new base numbering line
   * for the given base numbering
   * with zero base padding and zero numbering padding.
   */
  static unpadded<B extends Nucleobase>(bn: BaseNumbering<B>): BaseNumberingLine<B> {
    let line = BaseNumberingLine.connecting(bn);

    line.basePadding = 0;
    line.numberingPadding = 0;

    return line;
  }

  #basePadding;

  #numberingPadding;

  constructor(readonly domNode: SVGLineElement, readonly owner: BaseNumbering<B>) {
    this.#basePadding = distance(owner.owner.centerPoint, this.point1);

    let ownerBBox = Box.matching(owner.domNode.getBBox());

    this.#numberingPadding = distance(this.point2, ownerBBox.peripheralPoint(owner.displacement.direction + Math.PI));

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
   * The end point of the line that connects with the owner base of the base numbering.
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
   * The end point of the line that connects with the base numbering.
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
      + this.numberingPadding
      + distance(this.owner.centerPoint, ownerBBox.peripheralPoint(this.owner.displacement.direction + Math.PI))
    );
  }

  /**
   * The angle (in radians) that is the direction of the base numbering line
   * (from point 1 to point 2).
   */
  get direction(): number {
    return direction(this.point1, this.point2);
  }

  set direction(direction) {
    // cache length
    let length = this.length;

    this.owner.displacement.direction = direction;

    // maintain the length of the base numbering line
    this.length = length;
  }

  get basePadding(): number {
    return this.#basePadding;
  }

  set basePadding(basePadding) {
    this.#basePadding = basePadding;
    this.#reposition();
  }

  get numberingPadding(): number {
    return this.#numberingPadding;
  }

  set numberingPadding(numberingPadding) {
    this.#numberingPadding = numberingPadding;
    this.#reposition();
  }

  set(values: Partial<BaseNumberingLineValues>): void {
    values.attributes ? this.setAttributes(values.attributes) : {};

    isNumber(values.basePadding) ? this.basePadding = values.basePadding : {};
    isNumber(values.numberingPadding) ? this.numberingPadding = values.numberingPadding : {};
  }

  #reposition() {
    let d = this.owner.displacement.direction;

    this.domNode.setAttribute('x1', `${this.owner.owner.centerPoint.x + (this.#basePadding * Math.cos(d))}`);
    this.domNode.setAttribute('y1', `${this.owner.owner.centerPoint.y + (this.#basePadding * Math.sin(d))}`);

    let peripheralPoint = Box.matching(this.owner.domNode.getBBox()).peripheralPoint(d + Math.PI);

    this.domNode.setAttribute('x2', `${peripheralPoint.x + (this.#numberingPadding * Math.cos(d + Math.PI))}`);
    this.domNode.setAttribute('y2', `${peripheralPoint.y + (this.#numberingPadding * Math.sin(d + Math.PI))}`);
  }

  /**
   * Returns the serialized form of the base numbering.
   */
  serialized() {
    return {
      id: this.id,
      ownerID: this.owner.id,

      // directly save paddings (since recalculating them on deserialization is somewhat imprecise)
      basePadding: this.basePadding,
      numberingPadding: this.numberingPadding,
    };
  }

  /**
   * Deserializes the saved base numbering line.
   *
   * Throws if unable to do so.
   *
   * @param savedBaseNumberingLine The serialized form of the saved base numbering line.
   * @param parentDrawing The drawing that the saved base numbering line is in.
   */
  static deserialized<B extends Nucleobase>(savedBaseNumberingLine: unknown, parentDrawing: Drawing<B>): BaseNumberingLine<B> {
    if (!isNonNullObject(savedBaseNumberingLine)) { throw new Error('Saved base numbering line must be a non-null object.'); }

    if (!savedBaseNumberingLine.id) { throw new Error('Missing base numbering line ID.'); }
    if (!isString(savedBaseNumberingLine.id)) { throw new Error('Base numbering line ID must be a string.'); }

    let domNode = parentDrawing.domNode.querySelector('#' + savedBaseNumberingLine.id);
    if (!domNode) { throw new Error('Base numbering line DOM node not found.'); }
    if (!(domNode instanceof SVGLineElement)) { throw new Error('Base numbering line DOM node must be an SVG line element.'); }

    if (!savedBaseNumberingLine.ownerID) { throw new Error('Missing base numbering line owner ID.'); }
    if (!isString(savedBaseNumberingLine.ownerID)) { throw new Error('Base numbering line owner ID must be a string.'); }

    let owner = parentDrawing.baseNumberings.find(bn => bn.id === savedBaseNumberingLine.ownerID);
    if (!owner) { throw new Error('Base numbering line owner not found.'); }

    let line = new BaseNumberingLine(domNode, owner);

    if (isNumber(savedBaseNumberingLine.basePadding)) { line.basePadding = savedBaseNumberingLine.basePadding; }
    if (isNumber(savedBaseNumberingLine.numberingPadding)) { line.numberingPadding = savedBaseNumberingLine.numberingPadding; }

    return line;
  }
}

type BaseNumberingLineValues = {
  attributes: { [name: string]: string },
  basePadding: number;
  numberingPadding: number;
};

/**
 * The drawing interface used by base numbering lines.
 */
interface Drawing<B extends Nucleobase> {
  /**
   * The DOM node corresponding to the drawing.
   */
  domNode: SVGSVGElement;

  /**
   * All base numberings in the drawing.
   *
   * Is required to be an array to improve performance
   * (as opposed to allowing this to be any form of iterable).
   */
  baseNumberings: BaseNumbering<B>[];
}

type Point = {
  x: number;
  y: number;
};
