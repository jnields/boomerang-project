api=http://localhost:3000/api
json=Content-Type:application/json
w() {
    read -n 1 -s
}

getId() {
    python -c 'import sys, json; print json.load(sys.stdin)["id"]'
}

testAll() {
    loginAsAdmin
    testSchools
}

loginAsAdmin() {
    echo "AUTHENTICATE"
    curl -c ./cookies \
        -X GET \
        -k \
        http://jnields:password@localhost:3000/api/login
    w
}

loginAsTeacher() {
    echo "LOG IN AS TEACHER"
        curl -c ./cookies \
            -X GET \
            -k \
            http://jdoe%40gmail.com:password@localhost:3000/api/login
    w
}

testSchools() {
    echo "POST SCHOOL"
    school_id=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"name": "example name"}' \
        -k ${api}/schools \
        | tee /dev/tty \
        | getId )
    w
    echo "POST ANOTHER SCHOOL - WITH ADDRESS"
    school_id_2=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"name": "another name", "address": {"line1": "123 POST ST"}}' \
        -k ${api}/schools \
        | tee /dev/tty \
        | getId )
    w

    echo "GET SCHOOLS"
    curl -b ./cookies -X GET -k ${api}/schools
    w

    echo "GET SCHOOLS - OFFSET 1"
    curl -b ./cookies -X GET -k ${api}/schools\?\$offset=1
    w

    echo "GET SCHOOLS - LIMIT 1"
    curl -b ./cookies -X GET -k ${api}/schools\?\$limit=1
    w

    echo "GET SCHOOLS - LIMIT 1 OFFSET 1"
    curl -b ./cookies -X GET -k ${api}/schools\?\$limit=1\&\$offset=1
    w

    echo "GET SCHOOLS - LIMIT 1 OFFSET 1 SELECT NAME"
    curl -b ./cookies \
        -X GET \
        -k ${api}/schools\?\$limit=1\&\$offset=1\&\$select=name
    w

    echo "GET SCHOOL BY ID"
    curl -b ./cookies \
        -X GET \
        -k ${api}/schools/${school_id}
    w

    echo "GET SCHOOL BY ID - 404"
    curl -b ./cookies \
        -X GET \
        -k ${api}/schools/ASDF
    w

    echo "PATCH SCHOOL"
    curl -b ./cookies \
        -H $json \
        -X PATCH \
        -d '{"name":"New Name"}' \
        -k ${api}/schools/${school_id}
    w

    echo "PATCH SCHOOL ADDRESS - CREATE"
    curl -b ./cookies \
        -H $json \
        -X PATCH \
        -d '{"address": {"line1": "123 Changed"}}' \
        -k ${api}/schools/${school_id}
    w

    echo "PATCH SCHOOL ADDRESS - UPDATE"
    curl -b ./cookies \
        -H $json \
        -X PATCH \
        -d '{"address": {"line1": "123 CHANGED AGAIN"}}' \
        -k ${api}/schools/${school_id}
    w

    echo "PATCH SCHOOL ADDRESS - DELETE"
    curl -b ./cookies \
        -H $json \
        -X PATCH \
        -d '{"address": null}' \
        -k ${api}/schools/${school_id}

    testUsersAsAdmin

    loginAsTeacher
    testUsersAsTeacher
    loginAsAdmin

    echo "DELETE SCHOOL 404"
    curl -b ./cookies \
        -X DELETE \
        -k ${api}/schools/2359230520
    w

    echo "DELETE SCHOOL"
    curl -b ./cookies \
        -X DELETE \
        -k ${api}/schools/${school_id}
    w

    echo "ENSURE CASCADE - ENSURE 404"
    curl -b ./cookies \
        -X GET \
        -k "${api}/users/${student_id}"
    w
    curl -b ./cookies \
        -X GET \
        -k "${api}/users/${leader_id}"
    w
}

testUsersAsAdmin() {
    echo "ADD SCHOOL TEACHER WITH AUTH"
    teacher_id=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"TEACHER", "email": "jdoe@gmail.com", "firstName":"Jane", "lastName":"Doe", "gender":"F", "password":"password", "schoolId": '${school_id}'}' \
        -k ${api}/users/ \
        | tee /dev/tty \
        | getId)
    w
    echo "ADD SCHOOL STUDENT"
    student_id=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"STUDENT", "firstName":"Jane", "lastName":"Doe", "gender":"F","schoolId": '${school_id}'}' \
        -k ${api}/users/ \
        | tee /dev/tty \
        | getId)
    w

    echo "ADD SCHOOL LEADER"
    leader_id=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"LEADER", "firstName":"JOHN", "lastName":"LEADER", "gender":"F", "schoolId": '${school_id}'}' \
        -k ${api}/users/ \
        | tee /dev/tty \
        | getId)
    w

    echo "ADD SCHOOL2 STUDENT"
    student_id_2=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"STUDENT", "firstName":"JOHN", "lastName":"SCHOOL 2 STUDENT", "gender":"M", "schoolId": '${school_id_2}'}' \
        -k ${api}/users/ \
        | tee /dev/tty \
        | getId)
    w

    echo "ERROR: ADD USER WITHOUT TYPE"
    curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":null, "firstName":"Jane", "lastName":"Doe", "gender":"F", "password":"password", "schoolId": '${school_id}'}' \
        -k ${api}/users/
    w

    echo "ERROR: ADD TEACHER WITHOUT SCHOOL"
    curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"TEACHER"}' \
        -k ${api}/users/
    w

    echo "ERROR: ADD STUDENT WITHOUT SCHOOL"
    curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"STUDENT"}' \
        -k ${api}/users/
    w

    echo "GET SCHOOL TEACHERS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?school[id]=${school_id}&type=TEACHER"
    w
    echo "GET SCHOOL STUDENTS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?school[id]=${school_id}&type=STUDENT"
    w
    echo "GET SCHOOL LEADERS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?school[id]=${school_id}&type=LEADER"
    w
    echo "GET SCHOOL LEADERS & STUDENTS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?school[id]=${school_id}&type=STUDENT&type=LEADER"
    w
    echo "GET ALL"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?school[id]=${school_id}"
    w
    echo "GET ALL IN BOTH SCHOOLS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?school[id]=${school_id}&school[id]=${school_id_2}"
    w

    echo "GET BY ID"
    curl -b ./cookies \
        -X GET \
        -k "${api}/users/${teacher_id}"
    w

    echo "PATCH USER 404"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"firstName":"Johnathan","gender":"M"}' \
        -k ${api}/users/asdf
    w
    echo "PATCH USER"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"firstName":"Johnathan","gender":"M"}' \
        -k ${api}/users/${teacher_id}
    w

    echo "PATCH USER - UPDATE PASSWORD"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"firstName": "Changed", "password":"new password"}' \
        -k ${api}/users/${teacher_id}
    w

    echo "PATCH USER - DELETE PASSWORD"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"firstName": "Changed", "password":null}' \
        -k ${api}/users/${teacher_id}
    w

    echo "PATCH USER - INVALID PASSWORD"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"password":"1234"}' \
        -k ${api}/users/${teacher_id}
    w
    echo "PATCH USER - CREATE PASSWORD"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"password":"password"}' \
        -k ${api}/users/${teacher_id}
    w
    echo "PATCH USER - UPDATE EMAIL"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"email":"jdoe@g.com"}' \
        -k ${api}/users/${teacher_id}
    w

    echo "PATCH USER - UPDATE EMAIL AGAIN"
    curl -b ./cookies \
        -X PATCH \
        -H $json \
        -d '{"email":"jdoe@gmail.com"}' \
        -k ${api}/users/${teacher_id}
    w

    echo "DELETE USER 404"
    curl -b ./cookies \
        -X DELETE \
        -k ${api}/users/1240935092
    w

    echo "DELETE STUDENT"
    curl -b ./cookies \
        -X DELETE \
        -k ${api}/users/${student_id}
    w
}

testUsersAsTeacher() {
    echo "POST STUDENT AS TEACHER"
    teacher_student_id=$(curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"STUDENT", "firstName":"Jane", "lastName":"Doe", "gender":"F"}' \
        -k ${api}/users/ \
        | tee /dev/tty \
        | getId)
    w

    echo "403 - POST ADMIN AS TEACHER"
    curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"ADMIN", "firstName":"Jane", "lastName":"Doe", "gender":"F", "password":"password"}' \
        -k ${api}/users/
    w

    echo "POST TO OTHER SCHOOL AS TEACHER"
    curl -b ./cookies \
        -H $json \
        -X POST \
        -s \
        -d '{"type":"STUDENT", "schoolId": '${school_id_2}'}' \
        -k ${api}/users/
    w

    echo "GET SCHOOL'S TEACHERS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?type=TEACHER"
    w
    echo "GET SCHOOL'S STUDENTS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?type=STUDENT"
    w
    echo "GET SCHOOL'S LEADERS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?type=LEADER"
    w
    echo "GET SCHOOL'S LEADERS & STUDENTS"
    curl -b ./cookies \
        -X GET \
        -g \
        -k "${api}/users?type=STUDENT&type=LEADER"
    w

    echo "403 - PATCH TYPE TO ADMIN"
    curl -b ./cookies \
        -H $json \
        -X PATCH \
        -s \
        -d '{"type":"ADMIN"}' \
        -k ${api}/users/${teacher_student_id}
    w

}

testAll
