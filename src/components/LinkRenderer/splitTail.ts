export const splitTail = (str: string, tailSize: number) => {
  const tail = str.slice(tailSize * -1);
  const body = str.slice(0, Math.max(0, str.length - tailSize));
  return [body, tail];
};
