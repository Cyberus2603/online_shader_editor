// function updateVertex() {
//     let idoc = document.getElementById('vertex-iframe').contentWindow.document;
//     idoc.open();
//     idoc.write(vertex_editor.getValue());
//     idoc.close();
// }
// function updateFragment() {
//     let idoc = document.getElementById('fragment-iframe').contentWindow.document;
//     idoc.open();
//     idoc.write(fragment_editor.getValue());
//     idoc.close();
// }

function setupVertexEditor() {
    window.vertex_editor = ace.edit("vertex-editor");
    vertex_editor.setTheme("ace/theme/cobalt");
    vertex_editor.getSession().setMode("ace/mode/glsl");
    vertex_editor.setValue(`attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}`,1); //1 = moves cursor to end

    // veditor.getSession().on('change', function() {
    //     updateVertex();
    // });

    vertex_editor.setOptions({
        fontSize: "16pt",
        showLineNumbers: true,
        showGutter: false,
        vScrollBarAlwaysVisible:true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    });

    vertex_editor.setShowPrintMargin(false);
    vertex_editor.renderer.setShowGutter(true);
}

function setupFragmentEditor() {
    window.fragment_editor = ace.edit("fragment-editor");
    fragment_editor.setTheme("ace/theme/cobalt");
    fragment_editor.getSession().setMode("ace/mode/glsl");
    fragment_editor.setValue(`void main(void) {
       gl_FragColor = vec4(0.0,0.0,1.0,1.0);
}`,1); //1 = moves cursor to end

    // feditor.getSession().on('change', function() {
    //     updateFragment();
    // });

    fragment_editor.setOptions({
        fontSize: "16pt",
        showLineNumbers: true,
        showGutter: false,
        vScrollBarAlwaysVisible:true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    });

    fragment_editor.setShowPrintMargin(false);
    fragment_editor.renderer.setShowGutter(true);
}

function ready() {
    setupVertexEditor();
    setupFragmentEditor();
    InitGL();
}