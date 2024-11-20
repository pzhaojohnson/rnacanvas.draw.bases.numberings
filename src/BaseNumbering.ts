import type { Nucleobase } from './Nucleobase';

import type { Drawing } from './Drawing';

import { assignUUID } from '@rnacanvas/draw.svg';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

import { Vector } from '@rnacanvas/vectors.oopified';

import { displacement } from '@rnacanvas/points';

import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

import { isPoint } from '@rnacanvas/points';

export class BaseNumbering<B extends Nucleobase> {
  static defaultValues = {
    attributes: {
      'font-family': 'Arial',
      'font-size': '8',
      'font-weight': '400',
      'fill': '#808080',
    },
  };

  /**
   * Creates and returns a new base numbering
   * that numbers the given base the specified number.
   */
  static numbering<B extends Nucleobase>(b: B, n: number): BaseNumbering<B> {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    assignUUID(domNode);

    domNode.textContent = `${n}`;

    let bn = new BaseNumbering(domNode, b);

    bn.setAttributes(BaseNumbering.defaultValues.attributes);

    bn.displacement.magnitude = 0;

    return bn;
  }

  readonly centerPoint;

  #displacement;

  constructor(readonly domNode: SVGTextElement, readonly owner: B) {
    this.centerPoint = new CenterPoint(domNode);

    this.#displacement = Vector.matching(displacement(owner.centerPoint, this.centerPoint));

    owner.centerPoint.addEventListener('move', () => this.#reposition());
  }

  #reposition(): void {
    this.centerPoint.x = this.owner.centerPoint.x + this.#displacement.x;
    this.centerPoint.y = this.owner.centerPoint.y + this.#displacement.y;
  }

  get id() {
    return this.domNode.id;
  }

  get textContent() {
    return this.domNode.textContent;
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

  setAttributes(attributes: { [name: string]: string }): void {
    Object.entries(attributes).forEach(([name, value]) => this.setAttribute(name, value));
  }

  removeAttribute(name: string): void {
    this.domNode.removeAttribute(name);
  }

  get displacement() {
    const getX = () => this.#displacement.x;
    const setX = (x: number) => {
      this.#displacement.x = x;
      this.#reposition();
    }

    const getY = () => this.#displacement.y;
    const setY = (y: number) => {
      this.#displacement.y = y;
      this.#reposition();
    };

    const getMagnitude = () => this.#displacement.magnitude;
    const setMagnitude = (magnitude: number) => {
      this.#displacement.magnitude = magnitude;
      this.#reposition();
    };

    const getDirection = () => this.#displacement.direction;
    const setDirection = (direction: number) => {
      this.#displacement.direction = direction;
      this.#reposition();
    };

    return {
      get x() { return getX(); },
      set x(x) { setX(x); },

      get y() { return getY(); },
      set y(y) { setY(y); },

      get magnitude() { return getMagnitude(); },
      set magnitude(magnitude) { setMagnitude(magnitude); },

      get direction() { return getDirection(); },
      set direction(direction) { setDirection(direction); },
    };
  }

  /**
   * Returns the serialized form of the base numbering.
   */
  serialized() {
    return {
      id: this.id,
      ownerID: this.owner.id,

      // directly save (since recalculating displacement during deserialization is somewhat imprecise)
      displacement: { x: this.displacement.x, y: this.displacement.y },
    };
  }

  /**
   * Deserializes a saved base numbering.
   *
   * Throws if unable to do so.
   *
   * @param savedBaseNumbering The serialized form of the saved base numbering.
   * @param parentDrawing The drawing that the saved base numbering is in.
   */
  static deserialized<B extends Nucleobase>(savedBaseNumbering: unknown, parentDrawing: Drawing<B>) {
    if (!isNonNullObject(savedBaseNumbering)) { throw new Error('Saved base numbering must be a non-null object.'); }

    if (!savedBaseNumbering.id) { throw new Error('Missing base numbering ID.'); }
    if (!isString(savedBaseNumbering.id)) { throw new Error('Base numbering ID must be a string.'); }

    let domNode = parentDrawing.domNode.querySelector('#' + savedBaseNumbering.id);
    if (!domNode) { throw new Error('Base numbering DOM node not found.'); }
    if (!(domNode instanceof SVGTextElement)) { throw new Error('Base numbering DOM node must be an SVG text element.'); }

    if (!savedBaseNumbering.ownerID) { throw new Error('Missing base numbering owner ID.'); }
    if (!isString(savedBaseNumbering.ownerID)) { throw new Error('Base numbering owner ID must be a string.'); }

    let owner = parentDrawing.bases.find(b => b.id === savedBaseNumbering.ownerID);
    if (!owner) { throw new Error('Unable to find base numbering owner.'); }

    let bn = new BaseNumbering(domNode, owner);

    if (isPoint(savedBaseNumbering.displacement)) {
      bn.displacement.x = savedBaseNumbering.displacement.x;
      bn.displacement.y = savedBaseNumbering.displacement.y;
    }

    return bn;
  }
}
