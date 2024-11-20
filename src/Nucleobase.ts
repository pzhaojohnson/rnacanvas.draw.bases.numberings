/**
 * The nucleobase interface used by base numberings.
 */
export interface Nucleobase {
  id: string;

  readonly centerPoint: {
    x: number;
    y: number;

    addEventListener(name: 'move', listener: () => void): void;
  };
}
