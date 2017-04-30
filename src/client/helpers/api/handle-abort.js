export default function ({ abort, cancel, resolve }) {
  if (abort !== undefined) {
    Promise.resolve(abort).then((a) => {
      if (a && cancel) {
        cancel();
        resolve();
      }
    });
  }
}
