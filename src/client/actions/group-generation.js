// equal gender distribution
export function generateGroups(students) {
    const leaders = {
            M: [],
            F: [],
            NA: []
        }, nonLeaders = {
            M: [],
            F: [],
            NA: []
        };
    students.forEach(student => {
        const collection = student.isLeader ? leaders : nonLeaders;
        (collection[student.gender] || collection.NA).push(student);
    });

    const leaderCount =
            leaders.M.length
            + leaders.F.length
            + leaders.NA.length,
        groupCount = Math.floor(leaderCount / 2) || 1,
        groups = [];

    for (let i = 0; i < groupCount; i++) {
        groups.push({
            leaders: [],
            students: []
        });
    }
    const getGender = (type) => {
        const types = [];
        [type.M, type.F, type.NA].forEach(t => {
            t.length && types.push(t);
        });
        return types[
            Math.floor(Math.random() * types.length)
        ];
    };
    for (let i = 0, gender = getGender(leaders);
            gender;
            gender = getGender(leaders), i++) {
        i = i === groupCount ? 0 : i;
        groups[i].leaders.push(gender.pop());
    }
    for (let i = 0, gender = getGender(nonLeaders);
            gender;
            gender = getGender(nonLeaders), i++) {
        i = i === groupCount ? 0 : i;
        groups[i].students.push(gender.pop());
    }

    return groups;
}
