import { EventfulPoint } from './EventfulPoint';

/**
 * Meant for testing purposes.
 */
export class NucleobaseMock {
  id = `${Math.random()}`;

  centerPoint = new EventfulPoint();
}
