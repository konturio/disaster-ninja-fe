interface WithQuotient {
  [key: string]: any;
  x: {
    [key: string]: any;
    quotient: [string, string];
  };
  y: {
    [key: string]: any;
    quotient: [string, string];
  };
}

export function extractAvailableDenominators(
  correlationRates: WithQuotient[],
): string[][] {
  const xSet: Set<string> = new Set();
  const ySet: Set<string> = new Set();

  correlationRates.forEach(({ x, y }) => {
    xSet.add(x.quotient[1]);
    ySet.add(y.quotient[1]);
  });

  return [Array.from(xSet), Array.from(ySet)];
}
