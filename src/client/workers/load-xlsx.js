import xlsx from "xlsx";

onmessage = ({data: {properties, files}}) => {
    let i, f, promises = [];
    for (i = 0; i != files.length; ++i) {
        f = files[i];
        promises.push((file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = e.target.result,
                            workbook = xlsx.read(data, {type: "binary"});
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
            });
        })(f));
    }
    Promise.all(promises).then(
        values => {
            const result = [];
            values.forEach(arr => {
                const props = {};
                arr.forEach((row, ix) => {
                    if (ix) {
                        if(ix === 1) {
                            if (!Object.keys(props).some(
                                key =>
                                    properties.some(
                                        prop=>  prop.regex.test(props[key])
                                    )
                                )
                            ) {
                                throw new Error("invalid");
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
            postMessage({
                results: result.map(obj => mapObject(properties, obj)),
                status: "SUCCESS"
            });
        },
        error => {
            postMessage({
                error,
                status: "ERROR"
            });
        }
    );
};

function mapObject(properties, raw) {
    let result = {};
    Object.keys(raw).forEach(key => {
        let value = raw[key];
        key = key.toLowerCase().trim();
        properties.forEach(property => {
            if (property.regex.test(key)) {
                switch(property.dataType) {
                case "bool":
                    value = parseBool(value);
                    break;
                case "date":
                    value = parseDate(value);
                    break;
                case "number":
                    value = parseFloat(value);
                }
                property.setValue(result, value);
            }
        });
    });
    return result;
}

function extractData(workbook) {
    const result = [];
    workbook.SheetNames.forEach(sheet => {
        const worksheet = workbook.Sheets[sheet];
        Object.keys(worksheet).forEach(key => {
            if (key[0] === "!") return;
            let row = "", col = "" ;
            for (
                let i = 0, letter = key[i];
                i < key.length;
                letter = key[++i]
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

function parseBool(raw) {
    switch(Object.prototype.toString.call(raw)) {
    case "[object Number]":
    case "[object Boolean]":
        return raw ? true : false;
    case "[object String]":
        raw = raw.toLowerCase();
        return /^(y|true|1)$/.test(raw)
            ? true
            : /^(n|false|0)$/.test(raw)
                ? false
                : null;
    }
    return null;
}

function parseDate(date) {
    let parsed;
    switch(Object.prototype.toString.call(date)) {
    case "[object String]":
        parsed = Date.parse(date);
        return isNaN(parsed) ? null : parsed;
    case "[object Date]":
        return date;
    }
    return null;
}

const A = "A".charCodeAt(0);
function parseIndexFromLetter(col) {
    let result = 0, pow = 1;
    for (let i = col.length - 1; i >= 0; i--) {
        result += (col[i].charCodeAt(0) - A + 1) * pow;
        pow *= 26;
    }
    return result;
}
