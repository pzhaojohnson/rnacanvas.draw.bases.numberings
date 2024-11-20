import type { Nucleobase } from './Nucleobase';

import { assignUUID } from '@rnacanvas/draw.svg';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

import { Vector } from '@rnacanvas/vectors.oopified';

import { displacement } from '@rnacanvas/points';

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
}
