import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

/**
 * For working with saved numberings, which might possibly use old, legacy formats.
 */
export class VersionlessNumbering {
  #savedNumbering;

  constructor(savedNumbering: unknown) {
    if (!isNonNullObject(savedNumbering)) {
      throw new Error('Saved numberings must be non-null objects.');
    }

    this.#savedNumbering = savedNumbering;
  }

  /**
   * Throws if unable to find the ID of the saved numbering.
   */
  get id(): string | never {
    if (isString(this.#savedNumbering.id)) {
      return this.#savedNumbering.id;
    }

    // used to be saved as `textId`
    if (isString(this.#savedNumbering.textId)) {
      return this.#savedNumbering.textId;
    }

    throw new Error('Unable to find the ID of the saved numbering.');
  }

  /**
   * Throws if unable to find the owner ID of the saved numbering.
   */
  get ownerID(): string | never {
    if (isString(this.#savedNumbering.ownerID)) {
      return this.#savedNumbering.ownerID;
    }

    throw new Error('Unable to find the owner ID of the saved numbering.');
  }

  get displacement(): unknown {
    return this.#savedNumbering.displacement;
  }
}
