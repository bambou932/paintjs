const canvas = document.getElementById("Canvas");
const context = canvas.getContext("2d");
const lines = []; let color = 'black'; let size = context.lineWidth = 2.5;
const Colors = document.getElementsByClassName("ControlColor");
const Size = document.getElementById("ControlRange");
const Delete = document.getElementById("ControlDelete");

let MouseDown = false;
let MouseIn = false;
let mode = "write";

function drawCanvas(){
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height); //canvas 흰 화면으로 초기화

    const sizeOrigin = size;

    for(let i=0; i<lines.length; i++){ //배열 lines를 탐색하면서 캔버스 그림
        context.strokeStyle = lines[i][0];
        context.lineWidth = lines[i][1];
        context.beginPath();
        console.log(context.lineWidth);
        
        if(lines[i][1] === 'fill'){
            context.fillStyle = lines[i][0];
            context.fillRect(0,0, canvas.width, canvas.height);
        }

        else {
                for(let j=2; j<lines[i].length; j++){
                context.lineTo(lines[i][j][0], lines[i][j][1]);
                context.stroke();
            }
        }
    }

    size = sizeOrigin;
}
drawCanvas();

function onMouseDown(event) {
    MouseDown=true;

    if(mode === "write"){
        lines.push([color, size, [event.offsetX, event.offsetY]]);
        context.beginPath();
    }

    else if(mode === "delete"){
        const x = event.offsetX, y = event.offsetY;
        let length = lines.length;

        for(let i=0; i<length; i++){
            for(let j=2; j<lines[i].length; j++){
                if(x-5 <= lines[i][j][0] && lines[i][j][0] <= x+5 &&
                    y-5 <= lines[i][j][1] && lines[i][j][1] <= y+5){
                    lines.splice(i, 1);
                    length--;
                    drawCanvas();

                    break;
                }
            }
        }
    }

    else if(mode === "fill"){
        context.fillStyle = color;
        context.fillRect(0,0,canvas.width, canvas.height);
        lines.push([color, "fill"]);
    }
}

function onMouseMove(event) {
    if(MouseDown && MouseIn){
        if(mode === "write") {
            lines[lines.length-1].push([event.offsetX, event.offsetY]);
    
            context.lineTo(event.offsetX, event.offsetY);
            context.stroke();
            console.log(context.lineWidth);
        }

        else if(mode === "delete"){
            const x = event.offsetX, y = event.offsetY;
            let length = lines.length;

            for(let i=0; i<length; i++){
                for(let j=2; j<lines[i].length; j++){
                    if(x-5 <= lines[i][j][0] && lines[i][j][0] <= x+5 &&
                        y-5 <= lines[i][j][1] && lines[i][j][1] <= y+5){
                            lines.splice(i, 1);
                            length--;
                            drawCanvas();

                            break;
                        }
                }
            }
        } 
    
    } 
}

function onMouseUp(event) { MouseDown = false;}
function onMouseLeave(event) {MouseIn=false; context.beginPath(); MouseDown=false;}
function onMouseIn(event) {MouseIn=true;}


if(canvas){
    canvas.addEventListener("mouseenter", onMouseIn);
    canvas.addEventListener("mouseleave", onMouseLeave);

    canvas.addEventListener("mousedown",onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("contextmenu", function(event){event.preventDefault();})
}

if(Size){
    Size.addEventListener("input", function(event){
        size = context.lineWidth = event.target.value;
    })
}

for(let i=0; i<Colors.length; i++){
    Colors[i].addEventListener("click", function(event){
        color = context.strokeStyle = Colors[i].style.backgroundColor;
    })
}

document.getElementById("ControlReset").addEventListener("click", function(event){
    lines.length = 0;
    drawCanvas();
})

//버튼 ControlMode를 클릭하면
document.getElementById("ControlMode").addEventListener("click", function(event){
    switch(mode){
        case 'write':
            mode = 'delete';
            break;
        
        case 'delete':
            mode = 'fill';
            break;

        case 'fill':
            mode = "write";
            break;
    }

    document.getElementById("ControlMode").innerText = mode;
})

//버튼 ControlSave를 클릭하면 파일 저장
document.getElementById("ControlSave").addEventListener("click", function(event){
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "paint"; 
    link.click();
})