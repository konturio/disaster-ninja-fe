export function termination() {
  return new Promise((res) => {
    process.on('SIGINT', () => {
      console.log('\n');
      res();
    });
  });
}
