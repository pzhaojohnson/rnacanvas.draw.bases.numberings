import type { Nucleobase } from './Nucleobase';

import type { Drawing } from './Drawing';

import { assignUUID } from '@rnacanvas/draw.svg';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

import { Vector } from '@rnacanvas/vectors.oopified';

import { displacement } from '@rnacanvas/points';

import { VersionlessNumbering } from './VersionlessNumbering';

import { isPoint } from '@rnacanvas/points';

import { isFinitePoint as isFiniteVector } from '@rnacanvas/points';

export class Numbering<B extends Nucleobase> {
  static defaultValues = {
    attributes: {
      'font-family': 'Arial',
      'font-size': '8',
      'font-weight': '400',
      'fill': '#808080',
    },
  };

  /**
   * Creates and returns a new numbering
   * that numbers the specified base the specified number.
   */
  static numbering<B extends Nucleobase>(b: B, n: number): Numbering<B> {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    assignUUID(domNode);

    domNode.textContent = `${n}`;

    let bn = new Numbering(domNode, b);

    bn.setAttributes(Numbering.defaultValues.attributes);

    bn.displacement.magnitude = 0;

    return bn;
  }

  readonly centerPoint;

  constructor(readonly domNode: SVGTextElement, readonly owner: B) {
    this.centerPoint = new CenterPoint(domNode);

    if (!domNode.dataset.displacement) {
      domNode.dataset.displacement = JSON.stringify(displacement(owner.centerPoint, this.centerPoint));
    }

    owner.centerPoint.addEventListener('move', () => this.#reposition());
  }

  #reposition(): void {
    this.centerPoint.x = this.owner.centerPoint.x + this.#displacementX;
    this.centerPoint.y = this.owner.centerPoint.y + this.#displacementY;
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

  setAttributes(attributes: { [name: string]: string }): void {
    Object.entries(attributes).forEach(([name, value]) => this.setAttribute(name, value));
  }

  removeAttribute(name: string): void {
    this.domNode.removeAttribute(name);
  }

  get textContent() {
    return this.domNode.textContent;
  }

  set textContent(textContent) {
    this.domNode.textContent = textContent;
  }

  /**
   * The number that the text content of the numbering parses to.
   *
   * May evaluate to `NaN` if the text content of the numbering does not parse to a number.
   */
  get number(): number {
    return Number.parseFloat(this.textContent);
  }

  set number(number) {
    this.textContent = `${number}`;
  }

  get displacement() {
    const getX = () => this.#displacementX;
    const setX = (x: number) => {
      this.#displacementX = x;
    }

    const getY = () => this.#displacementY;
    const setY = (y: number) => {
      this.#displacementY = y;
    };

    const getMagnitude = () => this.#displacementMagnitude;
    const setMagnitude = (magnitude: number) => {
      this.#displacementMagnitude = magnitude;
    };

    const getDirection = () => this.#displacementDirection;
    const setDirection = (direction: number) => {
      this.#displacementDirection = direction;
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

  get #displacementX() {
    if (!this.domNode.dataset.displacement) {
      return 0;
    }

    let d: unknown;

    try {
      d = JSON.parse(this.domNode.dataset.displacement);
    } catch {
      return 0;
    }

    if (!isFiniteVector(d)) {
      return 0;
    }

    return d.x;
  }

  set #displacementX(displacementX) {
    this.domNode.dataset.displacement = JSON.stringify({
      x: displacementX,
      y: this.#displacementY,
    });

    this.#reposition();
  }

  get #displacementY() {
    if (!this.domNode.dataset.displacement) {
      return 0;
    }

    let d: unknown;

    try {
      d = JSON.parse(this.domNode.dataset.displacement);
    } catch {
      return 0;
    }

    if (!isFiniteVector(d)) {
      return 0;
    }

    return d.y;
  }

  set #displacementY(displacementY) {
    this.domNode.dataset.displacement = JSON.stringify({
      x: this.#displacementX,
      y: displacementY,
    });

    this.#reposition();
  }

  get #displacementMagnitude() {
    return Vector.matching({ x: this.#displacementX, y: this.#displacementY }).magnitude;
  }

  set #displacementMagnitude(displacementMagnitude) {
    let d = Vector.matching({ x: this.#displacementX, y: this.#displacementY });

    d.magnitude = displacementMagnitude;

    this.domNode.dataset.displacement = JSON.stringify({ x: d.x, y: d.y });

    this.#reposition();
  }

  get #displacementDirection() {
    return Vector.matching({ x: this.#displacementX, y: this.#displacementY }).direction;
  }

  set #displacementDirection(displacementDirection) {
    let d = Vector.matching({ x: this.#displacementX, y: this.#displacementY });

    d.direction = displacementDirection;

    this.domNode.dataset.displacement = JSON.stringify({ x: d.x, y: d.y });

    this.#reposition();
  }

  /**
   * Returns the serialized form of the numbering.
   */
  serialized() {
    return {
      id: this.id,
      ownerID: this.owner.id,
    };
  }

  /**
   * Deserializes a saved numbering.
   *
   * Throws if unable to do so.
   *
   * @param savedNumbering The serialized form of the saved numbering.
   * @param parentDrawing The drawing that the saved numbering is in.
   */
  static deserialized<B extends Nucleobase>(savedNumbering: unknown, parentDrawing: Drawing<B>) {
    let oldNumbering = new VersionlessNumbering(savedNumbering);

    let domNode = parentDrawing.domNode.querySelector('#' + oldNumbering.id);
    if (!domNode) { throw new Error('Numbering DOM node not found.'); }
    if (!(domNode instanceof SVGTextElement)) { throw new Error('Numbering DOM node must be an SVG text element.'); }

    let owner = parentDrawing.bases.find(b => b.id === oldNumbering.ownerID);
    if (!owner) { throw new Error('Unable to find numbering owner.'); }

    let newNumbering = new Numbering(domNode, owner);

    if (isPoint(oldNumbering.displacement)) {
      newNumbering.displacement.x = oldNumbering.displacement.x;
      newNumbering.displacement.y = oldNumbering.displacement.y;
    }

    return newNumbering;
  }
}
