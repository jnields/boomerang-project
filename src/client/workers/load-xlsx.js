import xlsx from 'xlsx';

function parseBool(raw) {
  switch (Object.prototype.toString.call(raw)) {
    case '[object Number]':
    case '[object Boolean]':
      return !!raw;
    case '[object String]':
      if (/^(y|true|1)$/i.test(raw)) {
        return true;
      }
      return /^(n|false|0)$/i.test(raw) ? false : null;
    default: return null;
  }
}

function parseDate(date) {
  let parsed;
  switch (Object.prototype.toString.call(date)) {
    case '[object String]':
      parsed = Date.parse(date);
      return isNaN(parsed) ? null : parsed;
    case '[object Date]':
      return date;
    default: return null;
  }
}

function mapObject(properties, raw) {
  const result = {};
  Object.keys(raw).forEach((key) => {
    let value = raw[key];
    properties.forEach((property) => {
      if (property.regex.test(key)) {
        switch (property.dataType) {
          case 'bool':
            value = parseBool(value);
            break;
          case 'date':
            value = parseDate(value);
            break;
          case 'number':
            value = parseFloat(value);
            break;
          default: break;
        }
        property.setValue(result, value);
      }
    });
  });
  return result;
}

const A = 'A'.charCodeAt(0);
function parseIndexFromLetter(col) {
  let result = 0;
  let pow = 1;
  for (let i = col.length - 1; i >= 0; i -= 1) {
    result += ((col[i].charCodeAt(0) - A) + 1) * pow;
    pow *= 26;
  }
  return result;
}

function extractData(workbook) {
  const result = [];
  workbook.SheetNames.forEach((sheet) => {
    const worksheet = workbook.Sheets[sheet];
    Object.keys(worksheet).forEach((key) => {
      if (key[0] === '!') return;
      let row = '';
      let col = '';
      for (
        let i = 0, letter = key[i];
        i < key.length;
        letter = key[(i += 1)]
      ) {
        if (/[A-Z]/.test(letter)) {
          col += letter;
        } else if (/[0-9]/.test(letter)) {
          row += letter;
        }
      }
      col = parseIndexFromLetter(col) - 1;
      row = parseInt(row, 10) - 1;
      result[row] = result[row] || [];
      result[row][col] = worksheet[key].v;
    });
  });
  return result;
}

async function handleMessage({ data: { properties, files } }) {
  const promises = [];
  for (
      let i = 0, f = files[i];
      i !== files.length;
      f = files[i += 1]
  ) {
    promises.push((file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: 'binary' });
          resolve(extractData(workbook));
        } catch (err) {
          reject(err);
        }
      };
      try {
        reader.readAsBinaryString(file);
      } catch (err) {
        reject(err);
      }
    }))(f));
  }
  const values = await Promise.all(promises);
  const result = [];
  values.forEach((arr) => {
    const props = {};
    arr.forEach((row, ix) => {
      if (ix) {
        if (ix === 1) {
          if (!Object.keys(props).some(
            key => properties.some(prop => prop.regex.test(props[key])))
          ) {
            throw new Error('Badly formatted spreadsheet');
          }
        }
        const rowObj = {};
        row.forEach((cell, ix2) => {
          rowObj[props[ix2]] = cell;
        });
        result.push(rowObj);
      } else {
        row.forEach((cell, ix2) => {
          props[ix2] = cell;
        });
      }
    });
  });
  return result.map(obj => mapObject(properties, obj));
}

onmessage = (message) => {
  handleMessage(message).then(
    (results) => {
      postMessage({ results });
    },
    (error) => {
      postMessage({ error });
    },
  );
};
