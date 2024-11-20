import type { Nucleobase } from './Nucleobase';

/**
 * The drawing interface used by base numberings.
 */
export interface Drawing<B extends Nucleobase> {
  /**
   * The DOM node corresponding to the drawing.
   */
  readonly domNode: SVGSVGElement;

  /**
   * All bases in the drawing.
   *
   * To improve performance, this is required to already be in array form
   * (rather than be any iterable).
   */
  readonly bases: B[];
}
