export const incrementId = (() => {
  const idCreator = function* () {
    let i = 0;
    while (true) yield i++;
  };
  const idsGenerator = idCreator();
  return () => String(idsGenerator.next().value);
})();
