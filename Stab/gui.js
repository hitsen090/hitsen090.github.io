// Listeners for all GUI
const canvas = $('#can')[0];
const canvasGUI = $('#cangui')[0];
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const ctxGUI = canvasGUI.getContext('2d');
let SETTINGS = {};
SETTINGS.stop = false;
SETTINGS.small = false;
let listeners = [
    /*
        sel: selector for input
        event: will set the event that the listener gets triggered by. `change` by default
        type: will set a default `callback`, decide if `preprocess` gets used and decide exact `def` behavior
        var: linked variable in `SETTINGS`
        def: default value of the input
        defVar: default value of the linked variable
        callback: if no type is specified, this is the body of the listener
        preprocess: only for sliders, self-explanatory
    */
    {sel: "#slider_charge", event: "input", type: "", var: "placedCharge", def: "0.602", defVar: 2, callback: e=>{
        SETTINGS.placedCharge = (10**parseFloat(e.target.value)) / 2;
        updateJSI18N();
    }},
    {sel: "#check_magnetic", type: "checkbox", var: "MAGNETIC", def: false, defVar: false},
    {sel: "#voltage_mode", type: "checkbox", var: "voltageInftyMode", def: false, defVar: false},
    {sel: "#angle_mode", type: "checkbox", var: "angleDistanceMode", def: false, defVar: false},
    {sel: "#powerlinetool_arrows", type: "checkbox", var: "powerlineToolArrows", def: true, defVar: true},
    {sel: "#check_equipot", type: "checkbox", var: "drawEquipotential", def: true, defVar: true},
    {sel: "#slider_equipot", type: "slider", var: "equipLineDensityCoef", def: "0.25", defVar: 4, preprocess: v => 1/parseFloat(v)},
    {sel: "#slider_equipot_d", type: "slider", var: "equipLineOpacity", def: "1", defVar: 1, preprocess: v => parseFloat(v)},
    {sel: "#slider_equipot_t", type: "slider", var: "equipLineThickness", def: "1", defVar: 1, preprocess: v => parseInt(v)},
    {sel: "#check_E", type: "checkbox", var: "drawArrows", def: false, defVar: false},
    {sel: "#slider_E", type: "slider", var: "arrowsSpacing", def: "20", defVar: 20, preprocess: v => parseFloat(v)},
    {sel: "#slider_E_d", type: "slider", var: "arrowsOpacity", def: "1", defVar: 1, preprocess: v => parseFloat(v)},
    {sel: "#slider_E_t", type: "slider", var: "arrowsThickness", def: "2", defVar: 2, preprocess: v => parseInt(v)},
    
    {sel: "#g", type: "", event: "input",var: "g", def: "9.8", defVar: 9.8, callback: e=>{
        SETTINGS.g = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#l", type: "", event: "input",var: "l", def: "1.9", defVar: 1.9, callback: e=>{
        SETTINGS.l = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#q", type: "", event: "input",var: "q", def: "1000", defVar: 1000, callback: e=>{
        SETTINGS.q = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#k", type: "", event: "input",var: "k", def: "10000", defVar: 10000, callback: e=>{
        SETTINGS.k = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#alpha", type: "", event: "input",var: "alpha", def: "0.3", defVar: 0.3, callback: e=>{
        SETTINGS.alpha = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#v", type: "", event: "input",var: "v", def: "10", defVar: 10, callback: e=>{
        SETTINGS.v = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#dt", type: "", event: "input",var: "dt", def: "0.001", defVar: 0.001, callback: e=>{
        SETTINGS.dt = parseFloat(e.target.value);
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}
    }},
    {sel: "#slider_E", type: "slider", var: "arrowsSpacing", def: "20", defVar: 20, callback: e=>{
        updateJSI18N();
    }},
    {sel: "#slider_E", type: "slider", var: "arrowsSpacing", def: "20", defVar: 20, preprocess: v => parseFloat(v)},
    
    {sel: "#check_E_head", type: "checkbox", var: "drawArrowHeads", def: true, defVar: true},
    {sel: "#check_powerline", type: "checkbox", var: "drawField", def: true, defVar: true},
    {sel: "#slider_powerline", type: "slider", var: "fieldDensity", def: "4", defVar: 4, preprocess: v => parseInt(v)},
    {sel: "#slider_powerline_d", type: "slider", var: "fieldOpacity", def: "1", defVar: 1, preprocess: v => parseFloat(v)},
    {sel: "#slider_powerline_t", type: "slider", var: "fieldThickness", def: "2", defVar: 2, preprocess: v => parseInt(v)},
    {sel: "#slider_powerline_q", type: "slider", var: "fieldQuality", def: "0.5", defVar: 0.5, preprocess: v => parseFloat(v)},
    {sel: "#check_bg", type: "checkbox", var: "drawBg", def: true, defVar: true},
    {sel: "#color_equipot", type: "color", var: "colorsEquipotential", def: "#ffffff", defVar: [255, 255, 255]},
    {sel: "#color_powerline", type: "color", var: "colorsField", def: "#00ff00", defVar: [0, 255, 0]},
    {sel: "#color_E", type: "color", var: "colorsArrows", def: "#ff00ff", defVar: [255, 0, 255]},
    {sel: "#color_bg_def", type: "color", var: "colorBgDefault", def: "#000000", defVar: [0, 0, 0]},
    {sel: "#color_pos", type: "color", var: "colorBgPos", def: "#ff0000", defVar: [255, 0, 0]},
    {sel: "#color_neg", type: "color", var: "colorBgNeg", def: "#0000ff", defVar: [0, 0, 255]},
    {sel: "#color_outline", type: "color", var: "colorOutline", def: "#ffffff", defVar: [255, 255, 255]},
    {sel: "#check_anim", type: "", var: "small", def: false, defVar: false, callback: e=>{
        if(SETTINGS.small){
            SETTINGS.small = false;
        }else{
            SETTINGS.small = true;
        }
        updateJSI18N();
        if(!SETTINGS.stop){
        SETTINGS.stop = true;
        render();}}}
];

SETTINGS.colorTool = [0, 255, 255];

// set default callbacks per type
for (let i of listeners) {
    let callback = () => {};
    switch (i.type) {
    case "checkbox":
        callback = () => {
            SETTINGS[i.var] = $(i.sel).is(":checked");
            render();
        };
        break;
    case "slider":
        callback = e => {
            SETTINGS[i.var] = i.preprocess(e.target.value);
            render();
        };
        break;
    case "color":
        callback = e => {
            SETTINGS[i.var] = hexToArr(e.target.value);
            //render();
        };
        break;
    default:
        callback = i.callback;
    }
    SETTINGS[i.var] = i.defVar;
    $(i.sel).on(i.event || "change", callback);
}

SETTINGS.mode = "charge";
let toolCoords = [];
$("#tools > input").on('change', e => {
    let prevMode = SETTINGS.mode;
    SETTINGS.mode = $('input[name="toolsgroup"]:checked').val();
    if (prevMode != SETTINGS.mode) {
        switch (SETTINGS.mode) {
        case "charge":
            toolCoords = [];
            break;
        case "voltage":
            if (window.innerWidth > 480) toolCoords = [
                { x: window.innerWidth/3, y: window.innerHeight/2 - 50 },
                { x: window.innerWidth*2/3, y: window.innerHeight/2 + 50 }
            ];
            else toolCoords = [
                { x: window.innerWidth/3, y: window.innerHeight/3 - 50 },
                { x: window.innerWidth*2/3, y: window.innerHeight/3 + 50 }
            ];
            break;
        case "angle":
            if (window.innerWidth > 480) toolCoords = [
                { x: window.innerWidth/3, y: window.innerHeight/2 - 50 },
                { x: window.innerWidth*2/3 - 50, y: window.innerHeight/2 },
                { x: window.innerWidth/3, y: window.innerHeight/2 + 50 }
            ];
            else toolCoords = [
                { x: window.innerWidth/3, y: window.innerHeight/3 - 50 },
                { x: window.innerWidth*2/3 - 50, y: window.innerHeight/3 },
                { x: window.innerWidth/3, y: window.innerHeight/3 + 50 }
            ];
            break;
        case "equipline":
            if (window.innerWidth > 480) toolCoords = [
                { x: window.innerWidth/2 - 50, y: window.innerHeight/2 - 50 }
            ];
            else toolCoords = [
                { x: window.innerWidth/2 - 50, y: window.innerHeight/3  - 50 }
            ];
            break;
        case "powerline":
            if (window.innerWidth > 480) toolCoords = [
                { x: window.innerWidth/2 - 50, y: window.innerHeight/2  - 50 }
            ];
            else toolCoords = [
                { x: window.innerWidth/2 - 50, y: window.innerHeight/3  - 50}
            ];
            break;
        }
        $('.holds').hide();
        $(`#hold_` + SETTINGS.mode).show();
    }
});

/*$("#val_charge").on('blur', e => {
    let text = $("#val_charge").text();
    let val = SETTINGS.placedCharge;
    try {
        val = Math.max(Math.min(parseFloat(text), 500), 0.5);
    } catch (e) {}
    if(!isNaN(text)) SETTINGS.placedCharge = val;
    $("#val_charge").html(SETTINGS.placedCharge.toFixed(2));
    $("#slider_charge").val(Math.log10(2*SETTINGS.placedCharge));
});*/

$("#btn_clear").on('click', e => {
    let message = SETTINGS.MAGNETIC ? I18N[LANG].clear_msgM : I18N[LANG].clear_msg;
    if (confirm(message)) {
        // delete charges
        charges = [];
        render();
    }
});

$("#btn_reset").on('click', e => {
    if (confirm(I18N[LANG].reset_msg)) {
        // reset all settings to default values
        for (let i of listeners) {
            SETTINGS[i.var] = i.defVar;
            if (i.type == "checkbox") {
                $(i.sel).prop("checked", i.def);
            } else {
                $(i.sel).val(i.def);
            }
        }
        render();
    }
});

$('#check_magnetic').on('change', e => {
    let magnetic = $('#check_magnetic').is(":checked");
    if (magnetic) {
        $('.m-hidden').hide();
        switchLanguage(LANG, true);
    } else {
        $('.m-hidden').show();
        switchLanguage(LANG, false);
    }
});

function updateJSI18N() {
    // update time/fps display
   // if (!SETTINGS.animatedMode) $('#progress').text(I18N[LANG].rendered.replace('%time%', lastRenderTime.toString()));
    //else {
       // $('#progress').html(I18N[LANG].rendered_fps.replace('%fps%', runningFPS.toFixed(2)));
   // }
    // update Coulomb units
  //  $("#val_charge").html(SETTINGS.placedCharge.toFixed(2));
    $("#gtext").html(SETTINGS.g.toFixed(2));
    $("#ltext").html(SETTINGS.l.toFixed(5));
    $("#ktext").html(SETTINGS.k.toFixed(2));
    $("#qtext").html(SETTINGS.q.toFixed(2));
    $("#alphatext").html(SETTINGS.alpha.toFixed(4));
    $("#vtext").html(SETTINGS.v.toFixed(2));
    $("#dttext").html(SETTINGS.dt.toFixed(6));
  //  $("#val_charge").html(SETTINGS.placedCharge.toFixed(2));
}

let sharedPotentialBuffer;
let sharedBgBuffer;
let setCanvasSize = () => {
    var bounds = canvas.getBoundingClientRect();
    canvas.setAttribute("width", bounds.width);
    canvas.width = bounds.width;
    canvas.setAttribute("height", bounds.height);
    canvas.height = bounds.height;
    canvasGUI.setAttribute("width", bounds.width);
    canvasGUI.width = bounds.width;
    canvasGUI.setAttribute("height", bounds.height);
    canvasGUI.height = bounds.height;

    const potsWidth = canvas.width + 10;
    const potsHeight = canvas.height + 10;
  /*  sharedPotentialBuffer = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * potsWidth * potsHeight);
    sharedBgBuffer = new SharedArrayBuffer(Uint8ClampedArray.BYTES_PER_ELEMENT * canvas.width * canvas.height * 4);*/

   // animateWithoutRequest();
    //render();
}
/*$(window).on("resize", debounce(() => {
    setCanvasSize();
    //animateWithoutRequest();
   // render();
}));*/

$("#collapse").on("click", () => {
    $("#controls").hide();
    $("#uncollapse").show();
});
$("#uncollapse").on("click", () => {
    $("#controls").show();
    $("#uncollapse").hide();
});


function setRealVh() {
  document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
}
setRealVh();
window.addEventListener('resize', setRealVh);