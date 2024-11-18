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
}
