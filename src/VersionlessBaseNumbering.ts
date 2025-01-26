import { isNonNullObject } from '@rnacanvas/value-check';

import { isString } from '@rnacanvas/value-check';

/**
 * For working with saved base numberings, which might possibly use old, legacy formats.
 */
export class VersionlessBaseNumbering {
  #savedBaseNumbering;

  constructor(savedBaseNumbering: unknown) {
    if (!isNonNullObject(savedBaseNumbering)) {
      throw new Error('Saved base numberings must be non-null objects.');
    }

    this.#savedBaseNumbering = savedBaseNumbering;
  }

  /**
   * Throws if unable to find the ID of the saved base numbering.
   */
  get id(): string | never {
    if (isString(this.#savedBaseNumbering.id)) {
      return this.#savedBaseNumbering.id;
    }

    // used to be saved as `textId`
    if (isString(this.#savedBaseNumbering.textId)) {
      return this.#savedBaseNumbering.textId;
    }

    throw new Error('Unable to find the ID of the saved base numbering.');
  }

  /**
   * Throws if unable to find the owner ID of the saved base numbering.
   */
  get ownerID(): string | never {
    if (isString(this.#savedBaseNumbering.ownerID)) {
      return this.#savedBaseNumbering.ownerID;
    }

    throw new Error('Unable to find the owner ID of the saved base numbering.');
  }

  get displacement(): unknown {
    return this.#savedBaseNumbering.displacement;
  }
}
