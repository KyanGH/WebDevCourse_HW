const switchBtn = document.getElementById("switchBtn");
const styleLink = document.getElementById("styleLink");
const styleList = ["./SKINS/basic.css", "./SKINS/dark.css", "./SKINS/modern.css"]
let num = 0;
switchBtn.addEventListener("click", ()=> {
    num = (num + 1) % 3
    styleLink.href = styleList[num];
});