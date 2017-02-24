import { schema } from "normalizr";

const school = new schema.Entity("schools"),
    user = new schema.Entity("users"),
    teacher = new schema.Entity("teachers", { school, user }),
    student = new schema.Entity("students", { school, user });

export { school, user, teacher, student };
