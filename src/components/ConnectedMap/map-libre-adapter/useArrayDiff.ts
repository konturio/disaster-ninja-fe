import { useEffect, useState, useRef } from 'react';

/* Remember result of last diff for use in next diff */
function memo<T>(initial: T): (X: (old: T) => T) => void {
  let memory = initial;
  return (update) => {
    memory = update(memory);
  };
}

function findDiff<T>(prev: T[], next: T[]): DiffState<T> {
  const needCheck = new Set(prev);
  const nextState: DiffState<T> = {
    added: [],
    deleted: [],
  };
  next.forEach((newEntry) => {
    // Is something new in array ?
    if (!needCheck.has(newEntry)) {
      nextState.added.push(newEntry);
    }
    // For remember what we already checked - delete entry from needCheck
    needCheck.delete(newEntry);
  });

  // All other old entry what not included in `next` array must be cleaned up
  nextState.deleted = Array.from(needCheck);
  return nextState;
}

interface DiffState<T> {
  added: T[];
  deleted: T[];
}

export function useArrayDiff<T>(newArray?: T[], freeze = false): DiffState<T> {
  const update = useRef(memo<T[]>([]));
  const [state, setState] = useState<DiffState<T>>({
    added: newArray ?? [],
    deleted: [],
  });

  useEffect(() => {
    update.current((lastArray) => {
      const nextArray = newArray?.filter((a) => a !== undefined) || [];
      if (lastArray.length + nextArray.length === 0) {
        // Both array empty - definitely nothing change.
        // This skip unnecessary operations and protect from loops in fallback cases
        return lastArray;
      }
      const diff = findDiff<T>(lastArray, nextArray);
      setState(diff);
      /* 
        freeze mean - don't remember result of this diff (freeze changes)
        In practice that mean next time value will compared with same value
      */
      return freeze ? lastArray : nextArray;
    });
  }, [newArray, freeze]);

  return state;
}
