let gl;
let shaderProgram;
let uPMatrix;
let vertexPositionBuffer;
let vertexColorBuffer;
let canvas;
let fragmentShader;
let vertexShader;

//Kod shaderów
let vertexShaderSource = `
    attribute vec3 aVertexPosition;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
  `;
let fragmentShaderSource = `
    void main(void) {
       gl_FragColor = vec4(0.0,0.0,1.0,1.0);
    }
  `;

function ReloadVertexShader(shader) {
    vertexShaderSource = shader;
    startGL();
}

function ReloadFragmentShader(shader) {
    fragmentShaderSource = shader;
    startGL();
}

function InitGL() {
    canvas = document.getElementById("webgl_renderer"); //wyszukanie obiektu w strukturze strony
    gl = canvas.getContext("experimental-webgl"); //pobranie kontekstu OpenGL'u z obiektu canvas
    gl.viewportWidth = canvas.width; //przypisanie wybranej przez nas rozdzielczości do systemu OpenGL
    gl.viewportHeight = canvas.height;
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //Stworzenie obiektu shadera
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    startGL();
}

function startGL() {
    gl.shaderSource(fragmentShader, fragmentShaderSource); //Podpięcie źródła kodu shader
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(fragmentShader); //Kompilacja kodu shader
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { //Sprawdzenie ewentualnych błedów kompilacji
        document.getElementById("error_log").innerHTML = gl.getShaderInfoLog(fragmentShader);
        return null;
    }
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        document.getElementById("error_log").innerHTML = gl.getShaderInfoLog(vertexShader);
        return null;
    }
    document.getElementById("error_log").innerHTML = "Compiled without errors 😱";

    shaderProgram = gl.createProgram(); //Stworzenie obiektu programu
    gl.attachShader(shaderProgram, vertexShader); //Podpięcie obu shaderów do naszego programu wykonywanego na karcie graficznej
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Could not initialise shaders");  //Sprawdzenie ewentualnych błedów

    //Opis sceny 3D, położenie punktów w przestrzeni 3D w formacie X,Y,Z
    let vertexPosition = [
        //Top
        -1.0, +1.0, -1.0,  -1.0, +1.0, +1.0,  +1.0, +1.0, +1.0, //3 punkty po 3 składowe - X1,Y1,Z1, X2,Y2,Z2, X3,Y3,Z3 - 1 trójkąt
        -1.0, +1.0, -1.0,  +1.0, +1.0, +1.0,  +1.0, +1.0, -1.0,
        //Left
        -1.0, -1.0, +1.0,  -1.0, +1.0, +1.0,  -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,  -1.0, +1.0, +1.0,  -1.0, +1.0, -1.0,
        //Right
        +1.0, +1.0, +1.0,  +1.0, -1.0, +1.0,  +1.0, -1.0, -1.0,
        +1.0, +1.0, +1.0,  +1.0, -1.0, -1.0,  +1.0, +1.0, -1.0,
        //Front
        +1.0, -1.0, +1.0,  +1.0, +1.0, +1.0,  -1.0, -1.0, +1.0,
        -1.0, +1.0, +1.0,  -1.0, -1.0, +1.0,  +1.0, +1.0, +1.0,
        //Back
        +1.0, +1.0, -1.0,  +1.0, -1.0, -1.0,  -1.0, -1.0, -1.0,
        +1.0, +1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, +1.0, -1.0,
        //Bottom
        -1.0, -1.0, +1.0,  -1.0, -1.0, -1.0,  +1.0, -1.0, +1.0,
        +1.0, -1.0, +1.0,  -1.0, -1.0, -1.0,  +1.0, -1.0, -1.0
    ]

    vertexPositionBuffer = gl.createBuffer(); //Stworzenie tablicy w pamieci karty graficznej
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3; //zdefiniowanie liczby współrzednych per wierzchołek
    vertexPositionBuffer.numItems = 12; //Zdefinoiowanie liczby punktów w naszym buforze

    //Opis sceny 3D, kolor każdego z wierzchołków
    let vertexColor = [
        //Top
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, //3 punkty po 3 składowe - R1,G1,B1, R2,G2,B2, R3,G3,B3 - 1 trójkąt
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
        //Left
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
        //Right
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
        //Front
        1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,
        //Back
        1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0,
        //Bottom
        0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0,
        0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0,
    ]

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    vertexColorBuffer.itemSize = 3;
    vertexColorBuffer.numItems = 12;

    //Macierze opisujące położenie wirtualnej kamery w przestrzenie 3D
    let aspect = gl.viewportWidth/gl.viewportHeight;
    let fov = 45.0 * Math.PI / 180.0; //Określenie pola widzenia kamery
    let zFar = 100.0; //Ustalenie zakresów renderowania sceny 3D (od obiektu najbliższego zNear do najdalszego zFar)
    let zNear = 0.1;
    uPMatrix = [
        1.0/(aspect*Math.tan(fov/2)),0                           ,0                         ,0                            ,
        0                         ,1.0/(Math.tan(fov/2))         ,0                         ,0                            ,
        0                         ,0                           ,-(zFar+zNear)/(zFar-zNear)  , -1,
        0                         ,0                           ,-(2*zFar*zNear)/(zFar-zNear) ,0.0,
    ];
    Tick();
}

let angleZ = 0.0;
let angleY = 0.0;
let angleX = 0.0;
let tz = -14.0;
let tx = 0.0;
let ty = -0.5;

function Tick() {
    let uMVMatrix = [
        1,0,0,0, //Macierz jednostkowa
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    let uMVRotZ = [
        +Math.cos(angleZ*Math.PI/180.0),+Math.sin(angleZ*Math.PI/180.0),0,0,
        -Math.sin(angleZ*Math.PI/180.0),+Math.cos(angleZ*Math.PI/180.0),0,0,
        0,0,1,0,
        0,0,0,1
    ];

    let uMVRotY = [
        +Math.cos(angleY*Math.PI/180.0),0,-Math.sin(angleY*Math.PI/180.0),0,
        0,1,0,0,
        +Math.sin(angleY*Math.PI/180.0),0,+Math.cos(angleY*Math.PI/180.0),0,
        0,0,0,1
    ];

    let uMVRotX = [
        1,0,0,0,
        0,+Math.cos(angleX*Math.PI/180.0),+Math.sin(angleX*Math.PI/180.0),0,
        0,-Math.sin(angleX*Math.PI/180.0),+Math.cos(angleX*Math.PI/180.0),0,
        0,0,0,1
    ];

    let uMVTranslateZ = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,tz,1
    ];

    let uMVTranslateX = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        tx,0,0,1
    ];

    let uMVTranslateY = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,ty,0,1
    ];
    uMVMatrix = MatrixMul(uMVMatrix,uMVRotX);
    uMVMatrix = MatrixMul(uMVMatrix,uMVRotY);
    uMVMatrix = MatrixMul(uMVMatrix,uMVRotZ);
    uMVMatrix = MatrixMul(uMVMatrix,uMVTranslateZ);
    uMVMatrix = MatrixMul(uMVMatrix,uMVTranslateX);
    uMVMatrix = MatrixMul(uMVMatrix,uMVTranslateY);

    //Render Scene
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(1.0,0.0,0.0,1.0); //Wyczyszczenie obrazu kolorem czerwonym
    gl.clearDepth(1.0);             //Wyczyścienie bufora głebi najdalszym planem
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram)   //Użycie przygotowanego programu shaderowego

    gl.enable(gl.DEPTH_TEST);           // Włączenie testu głębi - obiekty bliższe mają przykrywać obiekty dalsze
    gl.depthFunc(gl.LEQUAL);            //

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, new Float32Array(uPMatrix)); //Wgranie macierzy kamery do pamięci karty graficznej
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, new Float32Array(uMVMatrix));

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexPosition"));  //Przekazanie położenia
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"), vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexColor"));  //Przekazanie kolorów
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexColor"), vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems*vertexPositionBuffer.itemSize); //Faktyczne wywołanie rendrowania

    document.getElementById("output").innerHTML="Tx: "+tx+" Ty: " +ty+" Tz: "+tz;
    document.getElementById("output2").innerHTML="angleX: "+angleX%360+" angleY: " +angleY%360+" angleZ: "+angleZ%360;

    setTimeout(Tick,10);

}

