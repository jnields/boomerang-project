export default function () {
  const u = new Uint8Array(16);
  window.crypto.getRandomValues(u);
  return btoa(String.fromCharCode.apply(null, u));
}
