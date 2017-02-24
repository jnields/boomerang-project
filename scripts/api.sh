api=https://localhost:3000/api
json=Content-Type:application/json
w() {
    read -n 1 -s
}

getId() {
    python -c 'import sys, json; print json.load(sys.stdin)["id"]'
}
echo "AUTHENTICATE"
curl -c ./cookies -I -k https://jnields:password@localhost:3000/api
w

echo "GET SCHOOLS"
curl -b ./cookies -X GET -k ${api}/schools
w

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

echo "GET SCHOOL BY ID"
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}
w

echo "PATCH SCHOOL"
curl -b ./cookies \
    -H $json \
    -X PATCH \
    -d '{"name":"New Name"}' \
    -k ${api}/schools/${school_id}
w

echo "ADD SCHOOL TEACHER"
teacher_id=$(curl -b ./cookies \
    -H $json \
    -X POST \
    -s \
    -d '{"user":{"username": "jdoe", "firstName":"Jane", "lastName":"Doe", "gender":"F", "password":"password"}}' \
    -k ${api}/schools/${school_id}/teachers \
    | tee /dev/tty \
    | getId)
w

echo "ADD SCHOOL ITEM"
student_id=$(curl -b ./cookies \
    -H $json \
    -X POST \
    -s \
    -d '{"grade":11,"isLeader":false,"user":{"username": "jsmith", "firstName":"Jane", "lastName":"Smith", "gender":"F", "password":"password"}}' \
    -k ${api}/schools/${school_id}/students \
    | tee /dev/tty \
    | getId)
w

echo "GET SCHOOL TEACHERS"
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}/teachers
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}/teachers/${teacher_id}
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}/teachers/249120491
w

echo "GET SCHOOL ITEMS"
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}/students
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}/students/${student_id}
curl -b ./cookies \
    -X GET \
    -k ${api}/schools/${school_id}/students/12490230895
w

echo "PATCH SCHOOL TEACHER"
curl -b ./cookies \
    -X PATCH \
    -H $json \
    -d '{"user":{"firstName":"Johnathan","gender":"M"}}' \
    -k ${api}/schools/${school_id}/teachers/${teacher_id}
curl -b ./cookies \
    -X PATCH \
    -H $json \
    -d '{"user":{"firstName":"Johnathan","gender":"M"}}' \
    -k ${api}/schools/${school_id}/teachers/234092352
curl -b ./cookies \
    -X PATCH \
    -H $json \
    -d '{"user":{"firstName":"Johnathan","gender":"M"}}' \
    -k ${api}/schools/239500952039/teachers/${teacher_id}
w

echo "PATCH SCHOOL ITEM"
curl -b ./cookies \
    -X PATCH \
    -H $json \
    -d '{"isLeader":"true","user":{"firstName":"Diogo","gender":"M"}}' \
    -k ${api}/schools/${school_id}/students/${student_id}
curl -b ./cookies \
    -X PATCH \
    -H $json \
    -d '{"isLeader":"true","user":{"firstName":"Diogo","gender":"M"}}' \
    -k ${api}/schools/${school_id}/students/230490490
curl -b ./cookies \
    -X PATCH \
    -H $json \
    -d '{"isLeader":"true","user":{"firstName":"Diogo","gender":"M"}}' \
    -k ${api}/schools/123948294812/students/${student_id}
w

echo "DELETE SCHOOL ITEM"
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/${school_id}/students/1240935092
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/1230982384/students/${student_id}
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/${school_id}/students/${student_id}

echo "DELETE SCHOOL TEACHER"
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/1230293409/teachers/${teacher_id}
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/${school_id}/teachers/32985259823985
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/${school_id}/teachers/${teacher_id}
w

echo "DELETE SCHOOL"
curl -b ./cookies \
    -X DELETE \
    -k ${api}/schools/${school_id}
w
