import { schema } from "normalizr";

export const school = new schema.Entity("schools"),
    user = new schema.Entity("users"),
    teacher = new schema.Entity("teachers", { school, user }),
    student = new schema.Entity("students", { school, user });

export default { school, user, teacher, student };
