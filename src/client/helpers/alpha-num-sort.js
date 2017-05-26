const decimal = '.'.charCodeAt(0);
const zero = '0'.charCodeAt(0);
const nine = '9'.charCodeAt(0);

function chunkify(str) {
  const chunks = [];
  for (
    let ix = 0, chunkIx = -1, lastCharNum, charCode, char;
    ix < str.length;
    undefined
  ) {
    charCode = (char = str.charAt(ix)).charCodeAt(0);
    ix += 1;
    const thisCharNum = (
      charCode === decimal
      || (zero <= charCode && charCode <= nine)
    );

    // always true when ix == 0
    if (thisCharNum !== lastCharNum) {
      chunkIx += 1;
      chunks[chunkIx] = '';
      lastCharNum = thisCharNum;
    }
    chunks[chunkIx] += char;
  }
  return chunks;
}

export default function alphanum(a, b) {
  const aChunks = chunkify(a);
  const bChunks = chunkify(b);

  for (
    let i = 0, max = Math.min(aChunks.length, bChunks.length);
    i < max;
    i += 1
  ) {
    const aChunk = aChunks[i];
    const bChunk = bChunks[i];
    if (aChunk !== bChunk) {
      const aNum = Number(aChunk);
      const bNum = Number(bChunk);
      if (isNaN(aNum) || isNaN(bNum)) {
        return (aChunks[i] > bChunks[i]) ? 1 : -1;
      }
      return aNum - bNum;
    }
  }
  // a or b is empty string
  return aChunks.length - bChunks.length;
}
