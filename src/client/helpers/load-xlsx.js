export default function(files) {
    const xlsx = (window || {}).XLSX;
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

function parseStudent(student) {
    let grade, name, age, gender;
    Object.keys(student).forEach(key => {
        if (/first\s?name/.test(key)){
            name = student[key] + name;
        } else if (/last\s?name/.test(key)) {
            name = name + " " + student[key];
        } else if (/name/.test(key)) {
            name = student[key];
        }
        if (/(sex|gender)/.test(key)) {
            gender = student[key];
        }
        if (/age/.test(key)) {
            age = parseInt(student[key]);
        }
        if (/grade/.test(key)) {
            grade = student[key];
        }
    });
    return {
        grade, name, age, gender
    };
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
