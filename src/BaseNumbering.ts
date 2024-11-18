import type { Nucleobase } from './Nucleobase';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

import { Vector } from '@rnacanvas/vectors.oopified';

import { displacement } from '@rnacanvas/points';

export class BaseNumbering<B extends Nucleobase> {
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
}
