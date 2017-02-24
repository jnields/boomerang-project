import xlsx from "xlsx";
export default function(files) {
    let i, f, promises = [];
    for (i = 0, f = files[i]; i != files.length; ++i) {
        promises.push(new Promise((resolve, reject) => {
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
            reader.readAsBinaryString(f);
        }));
    }
    return Promise.all(promises).then(
        values => {
            const result = [];
            values.forEach(arr => {
                const props = {};
                arr.forEach((row, ix) => {
                    if (ix) {
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
            return result.map(parseStudent);
        },
        error => error
    );
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

function parseStudent(raw) {
    const user = {};
    const result = { user };
    Object.keys(raw).forEach(key => {
        const value = raw[key].toLowerCase();
        key = key.toLowerCase().trim();
        if (/^(first\s?)?name$/.test(key)){
            user.firstName = value;
        } else if (/^(last\s?name|surname)$/.test(key)) {
            user.lastName = value;
        }
        if (/^(sex|gender)$/.test(key)) {
            user.gender = value;
        }
        if (/^age$/.test(key)) {
            user.age = parseInt(value);
        }
        if (/^dob$/.test(key)) {
            user.dob = parseDate(value);
        }
        if (/^grade$/.test(key)) {
            result.grade = parseInt(key);
        }
        if(/^(is)?leader$/.test(key)) {
            result.isLeader = parseBool(value);
        }
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

const A = "A".charCodeAt(0);
function parseIndexFromLetter(col) {
    let result = 0, pow = 1;
    for (let i = col.length - 1; i >= 0; i--) {
        result += (col[i].charCodeAt(0) - A + 1) * pow;
        pow *= 26;
    }
    return result;
}
