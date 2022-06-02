export function sortByExample(example: unknown[]) {
  return (a: unknown, b: unknown) => {
    if (!example.includes(a) && example.includes(b)) {
      return 1;
    }

    if (example.includes(a) && !example.includes(b)) {
      return -1;
    }

    if (example.indexOf(a) > example.indexOf(b)) {
      return 1;
    }

    if (example.indexOf(a) < example.indexOf(b)) {
      return -1;
    }

    return 0;
  };
}
