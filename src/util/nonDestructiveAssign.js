/**
 * A non-destructive version of the native Object.assign method
 * @param {object} target The target object to assign properties to
 * @param {object} source The source object containing properties to assign
 * @returns The target object with properties assigned from the source object
 */
export function nonDestructiveAssign(target, source) {
  const entries = Object.entries(source);
  const length = entries.length;
  for (let index = 0; index < length; index++) {
    const [key, value] = entries[index];
    // Objects must be handled differently then primitives
    if (typeof value === "object") {
      // For Arrays we will push in any values that are not already present
      if (Array.isArray(value)) {
        // If the target key is undefined, make it an empty array
        if (target[key] === undefined) target[key] = [];
        // If the target key is not an array, make it an array and push the existing value
        if (!Array.isArray(target[key])) {
          target[key] = [target[key]];
        }
        const valueLength = value.length;
        //push in any values from source that are not already present
        for (let valueIndex = 0; valueIndex < valueLength; valueIndex++) {
          const item = value[valueIndex];
          if (!target[key].includes(item)) target[key].push(item);
        }
      // For null values we will only assign if the target key is undefined
      } else if (value === null) {
        if (target[key] === undefined) target[key] = null;
      // Otherwise we will recursively call nonDestructiveAssign to build the object
      } else {
        if (target[key] === undefined) target[key] = {};
        const replacement = nonDestructiveAssign(target[key], value);
        target[key] = replacement;
      }
    } else {
      if (target[key] === undefined) target[key] = value;
    }
  }
  return target;
}
