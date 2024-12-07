import { distance } from '@rnacanvas/points';

const createElementNS = document.createElementNS;

/**
 * Meant for testing purposes.
 */
export const SVGLineElementMock = {
  create: () => {
    let line = createElementNS.call(document, 'http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '0');
    line.setAttribute('y2', '0');

    line.x1 = { get baseVal() { return { value: Number.parseFloat(line.getAttribute('x1')) }; } };
    line.y1 = { get baseVal() { return { value: Number.parseFloat(line.getAttribute('y1')) }; } };
    line.x2 = { get baseVal() { return { value: Number.parseFloat(line.getAttribute('x2')) }; } };
    line.y2 = { get baseVal() { return { value: Number.parseFloat(line.getAttribute('y2')) }; } };

    line.getTotalLength = () => {
      let point1 = { x: line.x1.baseVal.value, y: line.y1.baseVal.value };
      let point2 = { x: line.x2.baseVal.value, y: line.y2.baseVal.value };
      return distance(point1, point2);
    };

    return line;
  },
}
