
let userObj = {
    username: "Kyan",
    grade:85,
    password: "pass123",
    isConnected:true,
    address:{
        country:"UK",
        city:"Adenbrugh",
        street:"This street"
    }
};

let newGrade = obj.grade + 10;
obj.grade += 10;
userObj.address.street = "";
userObj["address"] = {}; 