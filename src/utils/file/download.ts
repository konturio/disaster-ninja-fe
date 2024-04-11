export function downloadObject(
  data: unknown,
  fileName: string,
  indentation?: string | number,
) {
  const file = new Blob([JSON.stringify(data, null, indentation)], { type: 'json' });
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  clearTimeout(
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0),
  );
}
