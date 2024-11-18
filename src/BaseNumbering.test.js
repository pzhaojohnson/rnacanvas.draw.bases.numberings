/**
 * @jest-environment jsdom
 */

import { BaseNumbering } from './BaseNumbering';

describe('`class BaseNumbering`', () => {
  test('`constructor()`', () => {
    let domNode = SVGTextElementMock.create();

    domNode.setAttribute('x', '29');
    domNode.setAttribute('y', '113');
    domNode.setAttribute('font-size', '15');

    let owner = new NucleobaseMock();

    owner.centerPoint.x = 51;
    owner.centerPoint.y = -23;

    let bn = new BaseNumbering(domNode, owner);

    expect(bn.domNode).toBe(domNode);
    expect(bn.owner).toBe(owner);

    owner.centerPoint.x = 74;
    expect(bn.centerPoint.x).toBeCloseTo(57);

    owner.centerPoint.y = 116;
    expect(bn.centerPoint.y).toBeCloseTo(259.5);
  });
});

const SVGTextElementMock = {
  create: () => {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    text.x = {
      get baseVal() { return text.getAttribute('x').split(',').map(value => ({ value: Number.parseFloat(value) })); }
    };

    text.y = {
      get baseVal() { return text.getAttribute('y').split(',').map(value => ({ value: Number.parseFloat(value) })); }
    };

    text.getBBox = () => {
      let x = Math.min(...text.x.baseVal.map(length => length.value));
      let y = Math.min(...text.y.baseVal.map(length => length.value));

      let height = Number.parseFloat(text.getAttribute('font-size'));
      let width = (2 / 3) * height;

      return { x, y, width, height };
    };

    return text;
  },
}

class NucleobaseMock {
  centerPoint = new EventfulPoint();
}

class EventfulPoint {
  #eventListeners = {
    'move': [],
  };

  addEventListener(name, listener) {
    this.#eventListeners[name].push(listener);
  }

  #callEventListeners(name) {
    this.#eventListeners[name].forEach(listener => listener());
  }

  #x = 0;
  #y = 0;

  get x() { return this.#x; }
  set x(x) {
    this.#x = x;
    this.#callEventListeners('move');
  }

  get y() { return this.#y; }
  set y(y) {
    this.#y = y;
    this.#callEventListeners('move');
  }
}
