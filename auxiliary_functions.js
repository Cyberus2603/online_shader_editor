function createRect2(p1x,p1y,p1z,p2x,p2y,p2z,p3x,p3y,p3z,p4x,p4y,p4z) {
    return [p1x, p1y, p1z, p2x, p2y, p2z, p4x, p4y, p4z,  //Pierwszy trójkąt
        p1x, p1y, p1z, p4x, p4y, p4z, p3x, p3y, p3z];     //Drugi trójkąt
}

function createRectCoords(mu,mv,dau,dav,dbu,dbv) {
    let p1u = mu;
    let p1v = mv;
    let p2u = mu + dau;
    let p2v = mv + dav;
    let p3u = mu + dbu;
    let p3v = mv + dbv;
    let p4u = mu + dau + dbu;
    let p4v = mv + dav + dbv;
    return [p1u, p1v, p2u, p2v, p4u, p4v,  //Pierwszy trójkąt
        p1u, p1v, p4u, p4v, p3u, p3v];     //Drugi trójkąt
}

function createRectColor(r,g,b) {
    return [r, g, b, r, g, b, r, g, b,  //Pierwszy trójkąt
        r, g, b, r, g, b, r, g, b];     //Drugi trójkąt
}

function MatrixMul(a,b) {
    let c = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]
    for(let i=0;i<4;i++) {
        for(let j=0;j<4;j++) {
            c[i*4+j] = 0.0;
            for(let k=0;k<4;k++) {
                c[i*4+j]+= a[i*4+k] * b[k*4+j];
            }
        }
    }
    return c;
}

function ChangeAngleX(x) {
    if(x<0) for(x;x<0;x++) angleX=angleX-1.0;
    else for(x;x>0;x--) angleX=angleX+1.0;
}

function ChangeAngleY(y) {
    if(y<0) for(y;y<0;y++) angleY=angleY-1.0;
    else for(y;y>0;y--) angleY=angleY+1.0;
}

function ChangeAngleZ(z) {
    if(z<0) for(z;z<0;z++) angleZ=angleZ-1.0;
    else for(z;z>0;z--) angleZ=angleZ+1.0;
}

let x, y, z;
x=0;
y=0;
z=0;

function ChangePosX(x){
    tx+=x;
}

function ChangePosY(x){
    ty+=x;
}

function ChangePosZ(x){
    tz+=x;
}

function CreateSphere() {
    x=parseFloat(document.getElementById("x1").value);
    y=parseFloat(document.getElementById("y1").value);
    z=parseFloat(document.getElementById("z1").value);
    let vertexPosition = []; //3 punkty po 3 składowe - X1,Y1,Z1, X2,Y2,Z2, X3,Y3,Z3 - 1 trójkąt
    let stepElevation = 90/y;
    let stepAngle = 360/z;
    let radius = x;
    for(let elevation=-90; elevation< 90; elevation+= stepElevation) {
        let radiusXZ = radius*Math.cos(elevation*Math.PI/180);
        let radiusY  = radius*Math.sin(elevation*Math.PI/180);

        let radiusXZ2 = radius*Math.cos((elevation+stepElevation)*Math.PI/180);
        let radiusY2  = radius*Math.sin((elevation+stepElevation)*Math.PI/180);

        for(let angle = 0; angle < 360; angle+= stepAngle) {

            let px1 = radiusXZ*Math.cos(angle*Math.PI/180);
            let py1 = radiusY;
            let pz1 = radiusXZ*Math.sin(angle*Math.PI/180);

            let px2 = radiusXZ*Math.cos((angle+stepAngle)*Math.PI/180);
            let py2 = radiusY;
            let pz2 = radiusXZ*Math.sin((angle+stepAngle)*Math.PI/180);

            let px3 = radiusXZ2*Math.cos(angle*Math.PI/180);
            let py3 = radiusY2;
            let pz3 = radiusXZ2*Math.sin(angle*Math.PI/180);

            let px4 = radiusXZ2*Math.cos((angle+stepAngle)*Math.PI/180);
            let py4 = radiusY2;
            let pz4 = radiusXZ2*Math.sin((angle+stepAngle)*Math.PI/180);

            vertexPosition.push(...createRect2(px1,py1,pz1,px2,py2,pz2,px3,py3,pz3,px4,py4,pz4)); // Ściana XZ
        }
    }

    vertexPositionBuffer = gl.createBuffer(); //Stworzenie tablicy w pamieci karty graficznej
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3; //zdefiniowanie liczby współrzednych per wierzchołek
    vertexPositionBuffer.numItems = vertexPosition.length/9; //Zdefiniowanie liczby trójkątów w naszym buforze

    //Opis sceny 3D, kolor każdego z wierzchołków
    let vertexColor = []; //3 punkty po 3 składowe - R1,G1,B1, R2,G2,B2, R3,G3,B3 - 1 trójkąt
    let col1=0;
    let col2=0;
    let col3=0;
    for(let elevation=-90; elevation< 90; elevation+= stepElevation) {
        for(let angle = 0; angle < 360; angle+= stepAngle) {
            vertexColor.push(...createRectColor(col1,col2,col3));
        }
        col1+=1/(y*2);
        col2+=1/(y*2);
        col3=1/(y*2);
    }

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    vertexColorBuffer.itemSize = 3;
    vertexColorBuffer.numItems = vertexColor.length/9;

    let vertexCoords = []; //3 punkty po 2 składowe - U1,V1, U2,V2, U3,V3 - 1 trójkąt

    for(let elevation=-90; elevation< 90; elevation+= stepElevation) {
        for(let angle = 0; angle < 360; angle+= stepAngle) {
            vertexCoords.push(...createRectCoords(0,0,1,0,0,1));
        }
    }

    vertexCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexCoords), gl.STATIC_DRAW);
    vertexCoordsBuffer.itemSize = 2;
    vertexCoordsBuffer.numItems = vertexCoords.length/6;


    /*
    textureBuffer = gl.createTexture();
    var textureImg = new Image();
    textureImg.onload = function() { //Wykonanie kodu automatycznie po załadowaniu obrazka
      gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg); //Faktyczne załadowanie danych obrazu do pamieci karty graficznej
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Ustawienie parametrów próbkowania tekstury
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    textureImg.src="Tex.png"; //Nazwa obrazka*/
}


function CreateBox() {
    x=parseFloat(document.getElementById("x").value);
    y=parseFloat(document.getElementById("y").value);
    z=parseFloat(document.getElementById("z").value);
    //Opis sceny 3D, położenie punktów w przestrzeni 3D w formacie X,Y,Z
    let vertexPosition = []; //3 punkty po 3 składowe - X1,Y1,Z1, X2,Y2,Z2, X3,Y3,Z3 - 1 trójkąt
    let vertexColor = [];

    vertexPosition.push(...createRect2(0,0,0,x,0,0, 0,y,0, x,y,0));
    vertexPosition.push(...createRect2(0,0,-z, x,0,-z, 0,y,-z, x,y,-z));

    vertexPosition.push(...createRect2(0,0,0, 0,0,-z, 0,y,0, 0,y,-z));
    vertexPosition.push(...createRect2(x,0,0, x,0,-z, x,y,0, x,y,-z));

    vertexPosition.push(...createRect2(0,y,0, x,y,0, 0,y,-z, x,y,-z));
    vertexPosition.push(...createRect2(0,0,0, x,0,0, 0,0,-z, x,0,-z));
    let c = 0.1;
    for(let i=0;i<vertexPosition.length;i=i+1) {
        vertexColor.push(...[c,c,0.2]);
        c+=0.1;
    }

    vertexPositionBuffer = gl.createBuffer(); //Stworzenie tablicy w pamieci karty graficznej
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3; //zdefiniowanie liczby współrzednych per wierzchołek
    vertexPositionBuffer.numItems = vertexPosition.length/9; //Zdefinoiowanie liczby trójkątów w naszym buforze
    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    vertexColorBuffer.itemSize = 3;
    vertexColorBuffer.numItems = 12;
    tx=-x/2;
    ty=-y/2;
}
