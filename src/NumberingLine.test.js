/**
 * @jest-environment jsdom
 */

import { NumberingLine } from './NumberingLine';

import { SVGLineElementMock } from './SVGLineElementMock';

import { NucleobaseMock } from './NucleobaseMock';

import { SVGTextElementMock } from './SVGTextElementMock';

import { EventfulPoint } from './EventfulPoint';

import { distance, direction } from '@rnacanvas/points';

describe('`class NumberingLine`', () => {
  test('`static connecting()`', () => {
    let n = new NumberingMock();

    n.domNode.setAttribute('font-size', '12');

    n.centerPoint.x = -57;
    n.centerPoint.y = 105;

    n.owner.centerPoint.x = 23;
    n.owner.centerPoint.y = 64;

    NumberingLine.defaultValues.attributes['stroke'] = '#897118';

    NumberingLine.defaultValues.basePadding = 2.74;
    NumberingLine.defaultValues.textPadding = 6.28;

    let line = NumberingLine.connecting(n);

    // assigns a UUID
    expect(line.domNode.id).toBeTruthy();
    expect(line.domNode.id.length).toBeGreaterThanOrEqual(36);

    // positioned the line
    expect(Number.parseFloat(line.getAttribute('x1'))).toBeCloseTo(23 + (2.74 * Math.cos(Math.atan2(105 - 64, (-57) - 23))));
    expect(Number.parseFloat(line.getAttribute('y1'))).toBeCloseTo(64 + (2.74 * Math.sin(Math.atan2(105 - 64, (-57) - 23))));
    expect(Number.parseFloat(line.getAttribute('x2'))).toBeCloseTo(-47.41121918650282);
    expect(Number.parseFloat(line.getAttribute('y2'))).toBeCloseTo(100.0857498330827);

    // applied default values
    expect(line.getAttribute('stroke')).toBe('#897118');
    expect(line.basePadding).toBeCloseTo(2.74);
    expect(line.textPadding).toBeCloseTo(6.28);
  });

  test('`static unpadded()`', () => {
    let n = new NumberingMock();

    // make nonzero
    NumberingLine.defaultValues.basePadding = 8;
    NumberingLine.defaultValues.textPadding = 9;

    let line1 = NumberingLine.unpadded(n);
    expect(line1.basePadding).toBeCloseTo(0);
    expect(line1.textPadding).toBeCloseTo(0);

    // would otherwise have nonzero paddings
    let line2 = NumberingLine.connecting(n);
    expect(line2.basePadding).not.toBeCloseTo(0);
    expect(line2.textPadding).not.toBeCloseTo(0);
  });

  test('`constructor()`', () => {
    let owner = new NumberingMock();

    owner.domNode.setAttribute('font-size', '7');

    owner.centerPoint.x = 30;
    owner.centerPoint.y = -12;

    owner.owner.centerPoint.x = 101;
    owner.owner.centerPoint.y = 78;

    let line1 = NumberingLine.connecting(owner);

    line1.basePadding = 4.2;
    line1.textPadding = 2.7;

    let line2 = new NumberingLine(line1.domNode, owner);

    expect(line2.domNode).toBe(line1.domNode);
    expect(line2.owner).toBe(owner);

    expect(line2.basePadding).toBeCloseTo(4.2);
    expect(line2.textPadding).toBeCloseTo(2.7);

    // move owner numbering
    owner.centerPoint.x += 10;

    // the numbering line was repositioned
    expect(Number.parseFloat(line2.domNode.getAttribute('x1'))).toBeCloseTo(101 + (4.2 * Math.cos(Math.atan2((-12) - 78, 40 - 101))));
    expect(Number.parseFloat(line2.domNode.getAttribute('y1'))).toBeCloseTo(78 + (4.2 * Math.sin(Math.atan2((-12) - 78, 40 - 101))));
    expect(Number.parseFloat(line2.domNode.getAttribute('x2'))).toBeCloseTo(43.84817237820477);
    expect(Number.parseFloat(line2.domNode.getAttribute('y2'))).toBeCloseTo(-6.322368622320827);

    // move owner base
    owner.owner.centerPoint.y -= 15;

    // the numbering line was repositioned
    expect(Number.parseFloat(line2.domNode.getAttribute('x1'))).toBeCloseTo(101 + (4.2 * Math.cos(Math.atan2((-12) - 63, 40 - 101))));
    expect(Number.parseFloat(line2.domNode.getAttribute('y1'))).toBeCloseTo(63 + (4.2 * Math.sin(Math.atan2((-12) - 63, 40 - 101))));
    expect(Number.parseFloat(line2.domNode.getAttribute('x2'))).toBeCloseTo(44.036984640552305);
    expect(Number.parseFloat(line2.domNode.getAttribute('y2'))).toBeCloseTo(-7.036494294402903);
  });

  test('`get id()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    line.domNode.id = 'id-88297319827323';
    expect(line.id).toBe('id-88297319827323');
  });

  test('`hasAttribute()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    expect(line.hasAttribute('stroke-width')).toBe(false);

    line.domNode.setAttribute('stroke-width', '2');
    expect(line.hasAttribute('stroke-width')).toBe(true);
  });

  test('`getAttribute()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    line.domNode.setAttribute('stroke', '#abc772');
    expect(line.getAttribute('stroke')).toBe('#abc772');
  });

  test('`setAttribute()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    line.setAttribute('stroke-width', '6.24');
    expect(line.domNode.getAttribute('stroke-width')).toBe('6.24');
  });

  test('`setAttributes()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    // zero attributes
    expect(() => line.setAttributes({})).not.toThrow();

    // one attribute
    line.setAttributes({ 'stroke': '#bb6214' });
    expect(line.getAttribute('stroke')).toBe('#bb6214');

    // multiple attributes
    line.setAttributes({ 'stroke': '#00abc1', 'stroke-opacity': '0.521', 'stroke-width': '5.2' });
    expect(line.getAttribute('stroke')).toBe('#00abc1');
    expect(line.getAttribute('stroke-opacity')).toBe('0.521');
    expect(line.getAttribute('stroke-width')).toBe('5.2');
  });

  test('`removeAttribute()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    line.domNode.setAttribute('stroke-width', '2');
    expect(line.domNode.hasAttribute('stroke-width')).toBeTruthy();

    line.removeAttribute('stroke-width');
    expect(line.domNode.hasAttribute('stroke-width')).toBeFalsy();
  });

  test('`get x1()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    let line = new NumberingLine(domNode, owner);

    domNode.setAttribute('x1', '28.41');
    expect(line.x1).toBe(28.41);
  });

  test('`get y1()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    let line = new NumberingLine(domNode, owner);

    domNode.setAttribute('y1', '-2.5');
    expect(line.y1).toBe(-2.5);
  });

  test('`get point1()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    let line = new NumberingLine(domNode, owner);

    domNode.setAttribute('x1', '28.41');
    domNode.setAttribute('y1', '24.287');
    expect(line.point1).toStrictEqual({ x: 28.41, y: 24.287 });
  });

  test('`get x2()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    let line = new NumberingLine(domNode, owner);

    domNode.setAttribute('x2', '51.3');
    expect(line.x2).toBe(51.3);
  });

  test('`get y2()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    let line = new NumberingLine(domNode, owner);

    domNode.setAttribute('y2', '104');
    expect(line.y2).toBe(104);
  });

  test('`get point2()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    let line = new NumberingLine(domNode, owner);

    domNode.setAttribute('x2', '0.442');
    domNode.setAttribute('y2', '-18');
    expect(line.point2).toStrictEqual({ x: 0.442, y: -18 });
  });

  test('`get length()`', () => {
    let line = NumberingLine.unpadded(new NumberingMock());

    line.owner.centerPoint.set({ x: 47, y: 52 });
    line.owner.owner.centerPoint.set({ x: 44, y: 56 });

    expect(line.length).toBeCloseTo(5);
  });

  test('`set length()`', () => {
    let line = NumberingLine.connecting(new NumberingMock());

    line.owner.domNode.setAttribute('font-size', '14');

    line.owner.centerPoint.x = 29;
    line.owner.centerPoint.y = 54;

    line.owner.owner.centerPoint.x = 101;
    line.owner.owner.centerPoint.y = -205;

    line.basePadding = 5.2;
    line.textPadding = 2.8;

    expect(line.length).toBeCloseTo(253.55605611304114);

    line.length = 305;
    expect(line.length).toBeCloseTo(305);

    // did not move
    expect(line.owner.owner.centerPoint.x).toBeCloseTo(101);
    expect(line.owner.owner.centerPoint.y).toBeCloseTo(-205);

    // was moved
    expect(line.owner.centerPoint.x).toBeCloseTo(15.221474358623922);
    expect(line.owner.centerPoint.y).toBeCloseTo(103.56441862661677);

    expect(Number.parseFloat(line.getAttribute('x1'))).toBeCloseTo(99.60725426704077);
    expect(Number.parseFloat(line.getAttribute('y1'))).toBeCloseTo(-199.9899840994939);
    expect(Number.parseFloat(line.getAttribute('x2'))).toBeCloseTo(17.91736031462483);
    expect(Number.parseFloat(line.getAttribute('y2'))).toBeCloseTo(93.86671775711349);
  });

  test('`get direction()`', () => {
    let line = NumberingLine.unpadded(new NumberingMock());

    line.owner.centerPoint.set({ x: -12, y: 88 });
    line.owner.owner.centerPoint.set({ x: 41, y: 9 });

    expect(line.direction).toBeCloseTo(Math.atan2(88 - 9, (-12) - 41));
  });

  test('`set direction()`', () => {
    let line = NumberingLine.connecting(new NumberingMock());

    line.owner.domNode.setAttribute('font-size', '14');

    line.owner.centerPoint.x = 29;
    line.owner.centerPoint.y = 54;

    line.owner.owner.centerPoint.x = 101;
    line.owner.owner.centerPoint.y = -205;

    line.basePadding = 5.2;
    line.textPadding = 2.8;

    expect(line.direction).toBeCloseTo(1.8419423009857232);
    expect(line.length).toBeCloseTo(253.55605611304114);

    line.direction = -Math.PI / 3;
    expect(line.direction).toBeCloseTo(-Math.PI / 3);

    // was maintained
    expect(line.length).toBeCloseTo(253.55605611304114);

    // did not move
    expect(line.owner.owner.centerPoint.x).toBeCloseTo(101);
    expect(line.owner.owner.centerPoint.y).toBeCloseTo(-205);

    // was moved
    expect(line.owner.centerPoint.x).toBeCloseTo(235.819479940848);
    expect(line.owner.centerPoint.y).toBeCloseTo(-438.5141891075618);

    expect(Number.parseFloat(line.getAttribute('x1'))).toBeCloseTo(103.6);
    expect(Number.parseFloat(line.getAttribute('y1'))).toBeCloseTo(-209.50333209967908);
    expect(Number.parseFloat(line.getAttribute('x2'))).toBeCloseTo(230.3780280565206);
    expect(Number.parseFloat(line.getAttribute('y2'))).toBeCloseTo(-429.08931797696533);
  });

  test('`get basePadding()`', () => {
    let owner = new NumberingMock();

    owner.centerPoint.x = 101;
    owner.centerPoint.y = -23;

    owner.owner.centerPoint.x = 56;
    owner.owner.centerPoint.y = 88;

    NumberingLine.defaultValues.basePadding = 2.1;

    let line = NumberingLine.connecting(owner);

    expect(line.basePadding).toBeCloseTo(2.1);
  });

  test('`set basePadding()`', () => {
    let domNode = SVGLineElementMock.create();
    let owner = new NumberingMock();

    owner.centerPoint.x = 101;
    owner.centerPoint.y = -23;

    owner.owner.centerPoint.x = 56;
    owner.owner.centerPoint.y = 88;

    domNode.setAttribute('x1', '56');
    domNode.setAttribute('y1', '88');
    domNode.setAttribute('x2', '101');
    domNode.setAttribute('y2', '-23');

    let line = new NumberingLine(domNode, owner);

    line.basePadding = 3.9;
    expect(line.basePadding).toBeCloseTo(3.9);

    // the numbering line was repositioned
    expect(Number.parseFloat(domNode.getAttribute('x1'))).toBeCloseTo(56 + (3.9 * Math.cos(Math.atan2((-23) - 88, 101 - 56))));
    expect(Number.parseFloat(domNode.getAttribute('y1'))).toBeCloseTo(88 + (3.9 * Math.sin(Math.atan2((-23) - 88, 101 - 56))));
    expect(Number.parseFloat(domNode.getAttribute('x2'))).toBeCloseTo(101);
    expect(Number.parseFloat(domNode.getAttribute('y2'))).toBeCloseTo(-23);
  });

  test('`get textPadding()`', () => {
    let owner = new NumberingMock();

    owner.domNode.setAttribute('font-size', '9');

    owner.centerPoint.x = 101;
    owner.centerPoint.y = -23;

    owner.owner.centerPoint.x = 56;
    owner.owner.centerPoint.y = 88;

    NumberingLine.defaultValues.textPadding = 6.3;

    let line = NumberingLine.connecting(owner);

    expect(line.textPadding).toBeCloseTo(6.3);
  });

  test('`set textPadding()`', () => {
    let owner = new NumberingMock();

    owner.domNode.setAttribute('font-size', '11');

    owner.centerPoint.x = 101;
    owner.centerPoint.y = -23;

    owner.owner.centerPoint.x = 56;
    owner.owner.centerPoint.y = 88;

    let line = NumberingLine.unpadded(owner);
    expect(line.textPadding).toBeCloseTo(0);

    line.textPadding = 1.6;
    expect(line.textPadding).toBeCloseTo(1.6);

    // the numbering line was repositioned
    expect(Number.parseFloat(line.domNode.getAttribute('x1'))).toBeCloseTo(56);
    expect(Number.parseFloat(line.domNode.getAttribute('y1'))).toBeCloseTo(88);
    expect(Number.parseFloat(line.domNode.getAttribute('x2'))).toBeCloseTo(98.16914209628753);
    expect(Number.parseFloat(line.domNode.getAttribute('y2'))).toBeCloseTo(-16.017217170842553);
  });

  test('`set()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    expect(() => line.set({})).not.toThrow();

    line.set({ attributes: { 'stroke': '#898124', 'stroke-width': '5.1', 'stroke-opacity': '0.31' } });
    expect(line.getAttribute('stroke')).toBe('#898124');
    expect(line.getAttribute('stroke-width')).toBe('5.1');
    expect(line.getAttribute('stroke-opacity')).toBe('0.31');

    line.set({ basePadding: 4.19, textPadding: 5.83 });
    expect(line.basePadding).toBeCloseTo(4.19);
    expect(line.textPadding).toBeCloseTo(5.83);
  });

  test('`serialized()`', () => {
    let line = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());

    line.domNode.id = 'id-9391788927482';
    line.owner.id = 'id-212481289481';

    expect(line.serialized().id).toBe('id-9391788927482');
    expect(line.serialized().ownerID).toBe('id-212481289481');

    line.basePadding = 8.25;
    line.textPadding = 3.2219;

    expect(line.serialized().basePadding).toBeCloseTo(8.25);
    expect(line.serialized().textPadding).toBeCloseTo(3.2219);
  });

  test('`static deserialized()`', () => {
    let parentDrawing = new DrawingMock();

    [1, 2, 3, 4, 5].forEach(() => parentDrawing.domNode.append(SVGLineElementMock.create()));
    [1, 2, 3, 4, 5, 6].forEach(() => parentDrawing.numberings.push(new NumberingMock()));

    let line1 = new NumberingLine(SVGLineElementMock.create(), new NumberingMock());
    line1.domNode.id = 'id-8798147928724';

    parentDrawing.domNode.insertBefore(line1.domNode, parentDrawing.domNode.childNodes[2]);
    parentDrawing.numberings.splice(4, 0, line1.owner);

    expect(line1.domNode).toBeTruthy();
    expect(line1.owner).toBeTruthy();

    line1.basePadding = 3.18;
    line1.textPadding = 5.22;

    // not defined by JSDOM by default
    globalThis.SVGLineElement = globalThis.SVGLineElement ?? SVGElement;

    let line2 = NumberingLine.deserialized(line1.serialized(), parentDrawing);

    expect(line2.domNode).toBe(line1.domNode);
    expect(line2.owner).toBe(line1.owner);
    expect(line2.basePadding).toBeCloseTo(3.18);
    expect(line2.textPadding).toBeCloseTo(5.22);

    // without saved base padding and text padding
    let line3 = NumberingLine.deserialized({ ...line1.serialized(), basePadding: undefined, textPadding: undefined }, parentDrawing);

    expect(line3.domNode).toBe(line1.domNode);
    expect(line3.owner).toBe(line1.owner);
    expect(line3.basePadding).toBeCloseTo(3.18);
    expect(line3.textPadding).toBeCloseTo(5.22);
  });
});

const createElementNS = document.createElementNS;

document.createElementNS = (...args) => {
  if (args[0] === 'http://www.w3.org/2000/svg' && args[1] === 'text') {
    return SVGTextElementMock.create();
  } else if (args[0] === 'http://www.w3.org/2000/svg' && args[1] === 'line') {
    return SVGLineElementMock.create();
  } else {
    return createElementNS.call(document, ...args);
  }
};

class NumberingMock {
  domNode = SVGTextElementMock.create();

  owner = new NucleobaseMock();

  id = `${Math.random()}`;

  centerPoint = new EventfulPoint();

  constructor() {
    this.centerPoint.addEventListener('move', () => {
      let bbox = this.domNode.getBBox();

      this.domNode.setAttribute('x', `${this.centerPoint.x - (bbox.width / 2)}`);
      this.domNode.setAttribute('y', `${this.centerPoint.y - (bbox.height / 2)}`);
    });
  }

  get displacement() {
    let getMagnitude = () => distance(this.owner.centerPoint, this.centerPoint);
    let setMagnitude = magnitude => {
      let d = getDirection();
      this.centerPoint.x = this.owner.centerPoint.x + (magnitude * Math.cos(d));
      this.centerPoint.y = this.owner.centerPoint.y + (magnitude * Math.sin(d));
    };

    let getDirection = () => direction(this.owner.centerPoint, this.centerPoint);
    let setDirection = direction => {
      let m = getMagnitude();
      this.centerPoint.x = this.owner.centerPoint.x + (m * Math.cos(direction));
      this.centerPoint.y = this.owner.centerPoint.y + (m * Math.sin(direction));
    };

    return {
      get magnitude() { return getMagnitude(); },
      set magnitude(magnitude) { setMagnitude(magnitude); },

      get direction() { return getDirection(); },
      set direction(direction) { setDirection(direction); },
    };
  }
}

class DrawingMock {
  domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  numberings = [];
}
