export function readTextFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target === null) return;
      const s = event.target.result?.toString();
      if (!s) return;
      res(s);
    };
    reader.onerror = (error) => rej(error);
    reader.readAsText(file);
  });
}
