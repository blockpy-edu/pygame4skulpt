const R_STR = new Sk.builtin.str('r');
const G_STR = new Sk.builtin.str('g');
const B_STR = new Sk.builtin.str('b');
const A_STR = new Sk.builtin.str('a');
const LEFT_STR = new Sk.builtin.str('left');
const TOP_STR = new Sk.builtin.str('top');
const WIDTH_STR = new Sk.builtin.str('width');
const HEIGHT_STR = new Sk.builtin.str('height');


// Queue interface for the frontend
Sk.insertEvent = function (eventName) {
    var e = [];
    switch (eventName) {
        case "left":
            e = [PygameLib.constants.KEYDOWN, { key: PygameLib.constants.K_LEFT, unicode: "", mod: 0 }];
            break;
        case "right":
            e = [PygameLib.constants.KEYDOWN, { key: PygameLib.constants.K_RIGHT, unicode: "", mod: 0 }];
            break;
        case "up":
            e = [PygameLib.constants.KEYDOWN, { key: PygameLib.constants.K_UP, unicode: "", mod: 0 }];
            break;
        case "down":
            e = [PygameLib.constants.KEYDOWN, { key: PygameLib.constants.K_DOWN, unicode: "", mod: 0 }];
            break;
        case "quit":
            e = [PygameLib.constants.QUIT, { key: PygameLib.constants.K_ESCAPE, unicode: "", mod: 0 }];
            break;
    }
    PygameLib.eventQueue.unshift(e);
};

var PygameLib = {};
Sk.pygameData = {};

PygameLib.running = false;
PygameLib.caption = "pygame window";

PygameLib.extract_color = function (color) {
    var color_js = [0, 0, 0, 0];
    if (Sk.abstr.typeName(color) === "Color") {
        color_js[0] = Sk.ffi.remapToJs(Sk.abstr.gattr(color, R_STR, false));
        color_js[1] = Sk.ffi.remapToJs(Sk.abstr.gattr(color, G_STR, false));
        color_js[2] = Sk.ffi.remapToJs(Sk.abstr.gattr(color, B_STR, false));
        color_js[3] = Sk.ffi.remapToJs(Sk.abstr.gattr(color, A_STR, false));
    } else {
        color_js = Sk.ffi.remapToJs(color);
        if (color_js.length === 3) color_js.push(255);
    }
    color_js[3] = color_js[3]/255;
    return color_js;
};

PygameLib.extract_rect = function (rect) {
    var rect_js = [0, 0, 0, 0];
    if (Sk.abstr.typeName(rect) === "Rect") {
        rect_js[0] = Sk.ffi.remapToJs(Sk.abstr.gattr(rect, LEFT_STR, false));
        rect_js[1] = Sk.ffi.remapToJs(Sk.abstr.gattr(rect, TOP_STR, false));
        rect_js[2] = Sk.ffi.remapToJs(Sk.abstr.gattr(rect, WIDTH_STR, false));
        rect_js[3] = Sk.ffi.remapToJs(Sk.abstr.gattr(rect, HEIGHT_STR, false));
    } else {
        rect_js = Sk.ffi.remapToJs(rect);
    }
    return rect_js;
};

PygameLib.make_rect = function(a, b, c, d) {
    const t = new Sk.builtin.tuple([Sk.ffi.remapToPy(a),
                                       Sk.ffi.remapToPy(b),
                                       Sk.ffi.remapToPy(c),
                                       Sk.ffi.remapToPy(d),])
    return Sk.misceval.callsim(PygameLib.RectType, t);
};

var createKeyboardEvent = function (event) {
    var e;
    var keyPGConstant;
    if (event.type === "keyup") {
        keyPGConstant = PygameLib.constants.KEYUP;
    } else if (event.type === "keydown") {
        keyPGConstant = PygameLib.constants.KEYDOWN;
    }
    var keyId = event.which;
    // TODO: Support proper left/right handling
    // event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT
    const c = PygameLib.constants;
    var mod = c.KMOD_NONE +
        (c.KMOD_LSHIFT + c.KMOD_RSHIFT + c.KMOD_SHIFT) * event.shiftKey +
        (c.KMOD_LCTRL + c.KMOD_RCTRL + c.KMOD_CTRL) * event.ctrlKey +
        (c.KMOD_LALT + c.KMOD_RALT + c.KMOD_ALT) * event.altKey +
        (c.KMOD_LMETA + c.KMOD_RMETA + c.KMOD_META) * event.metaKey;

    switch (event.which) {
        case 27:
            return [PygameLib.constants.QUIT, { key: PygameLib.constants.K_ESCAPE, unicode: "", mod: mod }];
        case 37:
            return [keyPGConstant, { key: PygameLib.constants.K_LEFT, unicode: "", mod: mod }];
        case 38:
            return [keyPGConstant, { key: PygameLib.constants.K_UP, unicode: "", mod: mod }];
        case 39:
            return [keyPGConstant, { key: PygameLib.constants.K_RIGHT, unicode: "", mod: mod }];
        case 40:
            return [keyPGConstant, { key: PygameLib.constants.K_DOWN, unicode: "", mod: mod }];
        default:
            var difference = 0;
            if ((event.which <= 90) && (event.which >= 65))
                difference = 32;
            return [keyPGConstant, { key: (event.which + difference), unicode: event.key, mod: mod}];
    }
};

function keyEventListener(event) {
    var e = createKeyboardEvent(event);
    if(e[0] === PygameLib.constants.KEYDOWN)
        PygameLib.pressedKeys[e[1].key] = true
    else if ((e[0] === PygameLib.constants.KEYUP))
        delete PygameLib.pressedKeys[e[1].key]
    if (PygameLib.eventQueue) {
        if (PygameLib.repeatKeys) {
            PygameLib.eventQueue.unshift(e);
        } else {
            if (!('repeat' in event) || !event.repeat) { // Pygame considers autorepeat is turnd of by default
                PygameLib.eventQueue.unshift(e);
            }
        }

    }
    if (PygameLib.running) event.preventDefault();
    return false;
}


// constants
PygameLib.constants = {
    'ACTIVEEVENT': 1,
    'ANYFORMAT': 268435456,
    'ASYNCBLIT': 4,
    'AUDIO_S16': 32784,
    'AUDIO_S16LSB': 32784,
    'AUDIO_S16MSB': 36880,
    'AUDIO_S16SYS': 32784,
    'AUDIO_S8': 32776,
    'AUDIO_U16': 16,
    'AUDIO_U16LSB': 16,
    'AUDIO_U16MSB': 4112,
    'AUDIO_U16SYS': 16,
    'AUDIO_U8': 8,
    'AUDIODEVICEADDED': 4352,
    'AUDIODEVICEREMOVED': 4353,
    'BIG_ENDIAN': 4321,
    'BLEND_ADD': 1,
    'BLEND_MAX': 5,
    'BLEND_MIN': 4,
    'BLEND_MULT': 3,
    'BLEND_PREMULTIPLIED': 17,
    'BLEND_RGBA_ADD': 6,
    'BLEND_RGBA_MAX': 16,
    'BLEND_RGBA_MIN': 9,
    'BLEND_RGBA_MULT': 8,
    'BLEND_RGBA_SUB': 7,
    'BLEND_RGB_ADD': 1,
    'BLEND_RGB_MAX': 5,
    'BLEND_RGB_MIN': 4,
    'BLEND_RGB_MULT': 3,
    'BLEND_RGB_SUB': 2,
    'BLEND_SUB': 2,
    'BUTTON_X1': 6,
    'BUTTON_X2': 7,
    'DOUBLEBUF': 1073741824,
    'FINGERMOTION': 1794,
    'FINGERDOWN': 1792,
    'FINGERUP': 1793,
    'FULLSCREEN': -2147483648,
    'GL_ACCELERATED_VISUAL': 15,
    'GL_ACCUM_ALPHA_SIZE': 11,
    'GL_ACCUM_BLUE_SIZE': 10,
    'GL_ACCUM_GREEN_SIZE': 9,
    'GL_ACCUM_RED_SIZE': 8,
    'GL_ALPHA_SIZE': 3,
    'GL_BLUE_SIZE': 2,
    'GL_BUFFER_SIZE': 4,
    'GL_DEPTH_SIZE': 6,
    'GL_DOUBLEBUFFER': 5,
    'GL_GREEN_SIZE': 1,
    'GL_MULTISAMPLEBUFFERS': 13,
    'GL_MULTISAMPLESAMPLES': 14,
    'GL_RED_SIZE': 0,
    'GL_STENCIL_SIZE': 7,
    'GL_STEREO': 12,
    'GL_SWAP_CONTROL': 16,
    'HAT_CENTERED': 0,
    'HAT_DOWN': 4,
    'HAT_LEFT': 8,
    'HAT_LEFTDOWN': 12,
    'HAT_LEFTUP': 9,
    'HAT_RIGHT': 2,
    'HAT_RIGHTDOWN': 6,
    'HAT_RIGHTUP': 3,
    'HAT_UP': 1,
    'HAVE_NEWBUF': 1,
    'HWACCEL': 256,
    'HWPALETTE': 536870912,
    'HWSURFACE': 1,
    'IYUV_OVERLAY': 1448433993,
    'JOYAXISMOTION': 7,
    'JOYBALLMOTION': 8,
    'JOYBUTTONDOWN': 10,
    'JOYBUTTONUP': 11,
    'JOYHATMOTION': 9,
    'KEYDOWN': 2,
    'KEYUP': 3,
    'KMOD_ALT': 768,
    'KMOD_CAPS': 8192,
    'KMOD_CTRL': 192,
    'KMOD_LALT': 256,
    'KMOD_LCTRL': 64,
    'KMOD_LMETA': 1024,
    'KMOD_LSHIFT': 1,
    'KMOD_META': 3072,
    'KMOD_MODE': 16384,
    'KMOD_NONE': 0,
    'KMOD_NUM': 4096,
    'KMOD_RALT': 512,
    'KMOD_RCTRL': 128,
    'KMOD_RMETA': 2048,
    'KMOD_RSHIFT': 2,
    'KMOD_SHIFT': 3,
    'K_0': 48,
    'K_1': 49,
    'K_2': 50,
    'K_3': 51,
    'K_4': 52,
    'K_5': 53,
    'K_6': 54,
    'K_7': 55,
    'K_8': 56,
    'K_9': 57,
    'K_AMPERSAND': 38,
    'K_ASTERISK': 42,
    'K_AT': 64,
    'K_BACKQUOTE': 96,
    'K_BACKSLASH': 92,
    'K_BACKSPACE': 8,
    'K_BREAK': 318,
    'K_CAPSLOCK': 301,
    'K_CARET': 94,
    'K_CLEAR': 12,
    'K_COLON': 58,
    'K_COMMA': 44,
    'K_DELETE': 127,
    'K_DOLLAR': 36,
    'K_DOWN': 274,
    'K_END': 279,
    'K_EQUALS': 61,
    'K_ESCAPE': 27,
    'K_EURO': 321,
    'K_EXCLAIM': 33,
    'K_F1': 282,
    'K_F10': 291,
    'K_F11': 292,
    'K_F12': 293,
    'K_F13': 294,
    'K_F14': 295,
    'K_F15': 296,
    'K_F2': 283,
    'K_F3': 284,
    'K_F4': 285,
    'K_F5': 286,
    'K_F6': 287,
    'K_F7': 288,
    'K_F8': 289,
    'K_F9': 290,
    'K_FIRST': 0,
    'K_GREATER': 62,
    'K_HASH': 35,
    'K_HELP': 315,
    'K_HOME': 278,
    'K_INSERT': 277,
    'K_KP0': 256,
    'K_KP1': 257,
    'K_KP2': 258,
    'K_KP3': 259,
    'K_KP4': 260,
    'K_KP5': 261,
    'K_KP6': 262,
    'K_KP7': 263,
    'K_KP8': 264,
    'K_KP9': 265,
    'K_KP_DIVIDE': 267,
    'K_KP_ENTER': 271,
    'K_KP_EQUALS': 272,
    'K_KP_MINUS': 269,
    'K_KP_MULTIPLY': 268,
    'K_KP_PERIOD': 266,
    'K_KP_PLUS': 270,
    'K_LALT': 308,
    'K_LAST': 323,
    'K_LCTRL': 306,
    'K_LEFT': 276,
    'K_LEFTBRACKET': 91,
    'K_LEFTPAREN': 40,
    'K_LESS': 60,
    'K_LMETA': 310,
    'K_LSHIFT': 304,
    'K_LSUPER': 311,
    'K_MENU': 319,
    'K_MINUS': 45,
    'K_MODE': 313,
    'K_NUMLOCK': 300,
    'K_PAGEDOWN': 281,
    'K_PAGEUP': 280,
    'K_PAUSE': 19,
    'K_PERIOD': 46,
    'K_PLUS': 43,
    'K_POWER': 320,
    'K_PRINT': 316,
    'K_QUESTION': 63,
    'K_QUOTE': 39,
    'K_QUOTEDBL': 34,
    'K_RALT': 307,
    'K_RCTRL': 305,
    'K_RETURN': 13,
    'K_RIGHT': 275,
    'K_RIGHTBRACKET': 93,
    'K_RIGHTPAREN': 41,
    'K_RMETA': 309,
    'K_RSHIFT': 303,
    'K_RSUPER': 312,
    'K_SCROLLOCK': 302,
    'K_SEMICOLON': 59,
    'K_SLASH': 47,
    'K_SPACE': 32,
    'K_SYSREQ': 317,
    'K_TAB': 9,
    'K_UNDERSCORE': 95,
    'K_UNKNOWN': 0,
    'K_UP': 273,
    'K_a': 97,
    'K_b': 98,
    'K_c': 99,
    'K_d': 100,
    'K_e': 101,
    'K_f': 102,
    'K_g': 103,
    'K_h': 104,
    'K_i': 105,
    'K_j': 106,
    'K_k': 107,
    'K_l': 108,
    'K_m': 109,
    'K_n': 110,
    'K_o': 111,
    'K_p': 112,
    'K_q': 113,
    'K_r': 114,
    'K_s': 115,
    'K_t': 116,
    'K_u': 117,
    'K_v': 118,
    'K_w': 119,
    'K_x': 120,
    'K_y': 121,
    'K_z': 122,
    'LIL_ENDIAN': 1234,
    'MOUSEBUTTONDOWN': 5,
    'MOUSEBUTTONUP': 6,
    'MOUSEMOTION': 4,
    'MOUSEWHEEL': 1027,
    'MULTIGESTURE': 2050,

    'NOEVENT': 0,
    'NOFRAME': 32,
    'NUMEVENTS': 32,
    'OPENGL': 2,
    'OPENGLBLIT': 10,
    'PREALLOC': 16777216,
    'QUIT': 12,
    'RESIZABLE': 16,
    'RLEACCEL': 16384,
    'RLEACCELOK': 8192,
    'SCRAP_BMP': 'image/bmp',
    'SCRAP_CLIPBOARD': 0,
    'SCRAP_PBM': 'image/pbm',
    'SCRAP_PPM': 'image/ppm',
    'SCRAP_SELECTION': 1,
    'SCRAP_TEXT': 'text/plain',
    'SRCALPHA': 65536,
    'SRCCOLORKEY': 4096,
    'SWSURFACE': 0,
    'SYSWMEVENT': 13,
    'TEXTEDITING': 770,
    'TEXTINPUT': 771,
    'TIMER_RESOLUTION': 10,
    'USEREVENT': 24,
    'USEREVENT_DROPFILE': 4096,
    'UYVY_OVERLAY': 1498831189,
    'VIDEOEXPOSE': 17,
    'VIDEORESIZE': 16,
    'YUY2_OVERLAY': 844715353,
    'YV12_OVERLAY': 842094169,
    'YVYU_OVERLAY': 1431918169,

}

PygameLib.Colors = {
    'gray17': [43, 43, 43, 255],
    'gold': [255, 215, 0, 255],
    'gray10': [26, 26, 26, 255],
    'yellow': [255, 255, 0, 255],
    'gray11': [28, 28, 28, 255],
    'grey61': [156, 156, 156, 255],
    'grey60': [153, 153, 153, 255],
    'darkseagreen': [143, 188, 143, 255],
    'grey62': [158, 158, 158, 255],
    'grey65': [166, 166, 166, 255],
    'gray12': [31, 31, 31, 255],
    'grey67': [171, 171, 171, 255],
    'grey66': [168, 168, 168, 255],
    'grey69': [176, 176, 176, 255],
    'gray21': [54, 54, 54, 255],
    'lightsalmon4': [139, 87, 66, 255],
    'lightsalmon2': [238, 149, 114, 255],
    'lightsalmon3': [205, 129, 98, 255],
    'lightsalmon1': [255, 160, 122, 255],
    'gray32': [82, 82, 82, 255],
    'green4': [0, 139, 0, 255],
    'gray30': [77, 77, 77, 255],
    'gray31': [79, 79, 79, 255],
    'green1': [0, 255, 0, 255],
    'gray37': [94, 94, 94, 255],
    'green3': [0, 205, 0, 255],
    'green2': [0, 238, 0, 255],
    'darkslategray1': [151, 255, 255, 255],
    'darkslategray2': [141, 238, 238, 255],
    'darkslategray3': [121, 205, 205, 255],
    'aquamarine1': [127, 255, 212, 255],
    'aquamarine3': [102, 205, 170, 255],
    'aquamarine2': [118, 238, 198, 255],
    'papayawhip': [255, 239, 213, 255],
    'black': [0, 0, 0, 255],
    'darkorange3': [205, 102, 0, 255],
    'oldlace': [253, 245, 230, 255],
    'lightgoldenrod4': [139, 129, 76, 255],
    'gray90': [229, 229, 229, 255],
    'orchid1': [255, 131, 250, 255],
    'orchid2': [238, 122, 233, 255],
    'orchid3': [205, 105, 201, 255],
    'grey68': [173, 173, 173, 255],
    'brown': [165, 42, 42, 255],
    'purple2': [145, 44, 238, 255],
    'gray80': [204, 204, 204, 255],
    'antiquewhite3': [205, 192, 176, 255],
    'antiquewhite2': [238, 223, 204, 255],
    'antiquewhite1': [255, 239, 219, 255],
    'palevioletred3': [205, 104, 137, 255],
    'hotpink': [255, 105, 180, 255],
    'lightcyan': [224, 255, 255, 255],
    'coral3': [205, 91, 69, 255],
    'gray8': [20, 20, 20, 255],
    'gray9': [23, 23, 23, 255],
    'grey32': [82, 82, 82, 255],
    'bisque4': [139, 125, 107, 255],
    'cyan': [0, 255, 255, 255],
    'gray0': [0, 0, 0, 255],
    'gray1': [3, 3, 3, 255],
    'gray6': [15, 15, 15, 255],
    'bisque1': [255, 228, 196, 255],
    'bisque2': [238, 213, 183, 255],
    'bisque3': [205, 183, 158, 255],
    'skyblue': [135, 206, 235, 255],
    'gray': [190, 190, 190, 255],
    'darkturquoise': [0, 206, 209, 255],
    'rosybrown4': [139, 105, 105, 255],
    'deepskyblue3': [0, 154, 205, 255],
    'grey63': [161, 161, 161, 255],
    'indianred1': [255, 106, 106, 255],
    'grey78': [199, 199, 199, 255],
    'lightpink': [255, 182, 193, 255],
    'gray88': [224, 224, 224, 255],
    'gray22': [56, 56, 56, 255],
    'red': [255, 0, 0, 255],
    'grey11': [28, 28, 28, 255],
    'lemonchiffon3': [205, 201, 165, 255],
    'lemonchiffon2': [238, 233, 191, 255],
    'lemonchiffon1': [255, 250, 205, 255],
    'indianred3': [205, 85, 85, 255],
    'violetred1': [255, 62, 150, 255],
    'plum2': [238, 174, 238, 255],
    'plum1': [255, 187, 255, 255],
    'lemonchiffon4': [139, 137, 112, 255],
    'gray99': [252, 252, 252, 255],
    'grey13': [33, 33, 33, 255],
    'grey55': [140, 140, 140, 255],
    'darkcyan': [0, 139, 139, 255],
    'chocolate4': [139, 69, 19, 255],
    'lightgoldenrodyellow': [250, 250, 210, 255],
    'gray54': [138, 138, 138, 255],
    'lavender': [230, 230, 250, 255],
    'chartreuse3': [102, 205, 0, 255],
    'chartreuse2': [118, 238, 0, 255],
    'chartreuse1': [127, 255, 0, 255],
    'grey48': [122, 122, 122, 255],
    'grey16': [41, 41, 41, 255],
    'thistle': [216, 191, 216, 255],
    'chartreuse4': [69, 139, 0, 255],
    'darkorchid4': [104, 34, 139, 255],
    'grey42': [107, 107, 107, 255],
    'grey41': [105, 105, 105, 255],
    'grey17': [43, 43, 43, 255],
    'dimgrey': [105, 105, 105, 255],
    'dodgerblue4': [16, 78, 139, 255],
    'darkorchid2': [178, 58, 238, 255],
    'darkorchid3': [154, 50, 205, 255],
    'blue': [0, 0, 255, 255],
    'rosybrown2': [238, 180, 180, 255],
    'honeydew': [240, 255, 240, 255],
    'gray18': [46, 46, 46, 255],
    'cornflowerblue': [100, 149, 237, 255],
    'grey91': [232, 232, 232, 255],
    'gray14': [36, 36, 36, 255],
    'gray15': [38, 38, 38, 255],
    'gray16': [41, 41, 41, 255],
    'maroon4': [139, 28, 98, 255],
    'maroon3': [205, 41, 144, 255],
    'maroon2': [238, 48, 167, 255],
    'maroon1': [255, 52, 179, 255],
    'gray13': [33, 33, 33, 255],
    'gold3': [205, 173, 0, 255],
    'gold2': [238, 201, 0, 255],
    'gold1': [255, 215, 0, 255],
    'grey79': [201, 201, 201, 255],
    'palevioletred1': [255, 130, 171, 255],
    'palevioletred2': [238, 121, 159, 255],
    'gold4': [139, 117, 0, 255],
    'gray41': [105, 105, 105, 255],
    'gray84': [214, 214, 214, 255],
    'mediumpurple': [147, 112, 219, 255],
    'rosybrown1': [255, 193, 193, 255],
    'lightblue2': [178, 223, 238, 255],
    'lightblue3': [154, 192, 205, 255],
    'grey57': [145, 145, 145, 255],
    'lightblue1': [191, 239, 255, 255],
    'lightblue4': [104, 131, 139, 255],
    'gray33': [84, 84, 84, 255],
    'skyblue4': [74, 112, 139, 255],
    'grey97': [247, 247, 247, 255],
    'skyblue1': [135, 206, 255, 255],
    'gray27': [69, 69, 69, 255],
    'skyblue3': [108, 166, 205, 255],
    'skyblue2': [126, 192, 238, 255],
    'lavenderblush1': [255, 240, 245, 255],
    'darkgrey': [169, 169, 169, 255],
    'lavenderblush3': [205, 193, 197, 255],
    'darkslategrey': [47, 79, 79, 255],
    'lavenderblush4': [139, 131, 134, 255],
    'deeppink4': [139, 10, 80, 255],
    'grey99': [252, 252, 252, 255],
    'gray36': [92, 92, 92, 255],
    'coral4': [139, 62, 47, 255],
    'magenta3': [205, 0, 205, 255],
    'lightskyblue4': [96, 123, 139, 255],
    'mediumturquoise': [72, 209, 204, 255],
    'gray34': [87, 87, 87, 255],
    'floralwhite': [255, 250, 240, 255],
    'grey39': [99, 99, 99, 255],
    'grey36': [92, 92, 92, 255],
    'grey37': [94, 94, 94, 255],
    'grey34': [87, 87, 87, 255],
    'gray26': [66, 66, 66, 255],
    'royalblue2': [67, 110, 238, 255],
    'grey33': [84, 84, 84, 255],
    'turquoise1': [0, 245, 255, 255],
    'grey31': [79, 79, 79, 255],
    'steelblue1': [99, 184, 255, 255],
    'sienna4': [139, 71, 38, 255],
    'steelblue3': [79, 148, 205, 255],
    'lavenderblush2': [238, 224, 229, 255],
    'sienna1': [255, 130, 71, 255],
    'steelblue4': [54, 100, 139, 255],
    'sienna3': [205, 104, 57, 255],
    'aquamarine4': [69, 139, 116, 255],
    'lightyellow1': [255, 255, 224, 255],
    'lightyellow2': [238, 238, 209, 255],
    'lightsteelblue': [176, 196, 222, 255],
    'lightyellow4': [139, 139, 122, 255],
    'magenta2': [238, 0, 238, 255],
    'lightskyblue1': [176, 226, 255, 255],
    'lightgoldenrod': [238, 221, 130, 255],
    'magenta4': [139, 0, 139, 255],
    'gray87': [222, 222, 222, 255],
    'greenyellow': [173, 255, 47, 255],
    'navajowhite4': [139, 121, 94, 255],
    'darkslategray4': [82, 139, 139, 255],
    'olivedrab': [107, 142, 35, 255],
    'navajowhite1': [255, 222, 173, 255],
    'navajowhite2': [238, 207, 161, 255],
    'darkgoldenrod1': [255, 185, 15, 255],
    'sienna': [160, 82, 45, 255],
    'blue1': [0, 0, 255, 255],
    'yellow1': [255, 255, 0, 255],
    'gray61': [156, 156, 156, 255],
    'magenta1': [255, 0, 255, 255],
    'grey52': [133, 133, 133, 255],
    'orangered4': [139, 37, 0, 255],
    'palegreen': [152, 251, 152, 255],
    'gray86': [219, 219, 219, 255],
    'grey80': [204, 204, 204, 255],
    'seashell': [255, 245, 238, 255],
    'royalblue': [65, 105, 225, 255],
    'firebrick3': [205, 38, 38, 255],
    'blue4': [0, 0, 139, 255],
    'peru': [205, 133, 63, 255],
    'gray60': [153, 153, 153, 255],
    'aquamarine': [127, 255, 212, 255],
    'grey53': [135, 135, 135, 255],
    'tan4': [139, 90, 43, 255],
    'darkgoldenrod': [184, 134, 11, 255],
    'tan2': [238, 154, 73, 255],
    'tan1': [255, 165, 79, 255],
    'darkslategray': [47, 79, 79, 255],
    'royalblue3': [58, 95, 205, 255],
    'red2': [238, 0, 0, 255],
    'red1': [255, 0, 0, 255],
    'dodgerblue': [30, 144, 255, 255],
    'violetred4': [139, 34, 82, 255],
    'lightyellow': [255, 255, 224, 255],
    'paleturquoise1': [187, 255, 255, 255],
    'firebrick2': [238, 44, 44, 255],
    'mediumaquamarine': [102, 205, 170, 255],
    'lemonchiffon': [255, 250, 205, 255],
    'chocolate': [210, 105, 30, 255],
    'orchid4': [139, 71, 137, 255],
    'maroon': [176, 48, 96, 255],
    'gray38': [97, 97, 97, 255],
    'darkorange4': [139, 69, 0, 255],
    'mintcream': [245, 255, 250, 255],
    'darkorange1': [255, 127, 0, 255],
    'antiquewhite': [250, 235, 215, 255],
    'darkorange2': [238, 118, 0, 255],
    'grey18': [46, 46, 46, 255],
    'grey19': [48, 48, 48, 255],
    'grey38': [97, 97, 97, 255],
    'moccasin': [255, 228, 181, 255],
    'grey10': [26, 26, 26, 255],
    'chocolate1': [255, 127, 36, 255],
    'chocolate2': [238, 118, 33, 255],
    'chocolate3': [205, 102, 29, 255],
    'saddlebrown': [139, 69, 19, 255],
    'grey15': [38, 38, 38, 255],
    'darkslateblue': [72, 61, 139, 255],
    'lightskyblue': [135, 206, 250, 255],
    'gray69': [176, 176, 176, 255],
    'gray68': [173, 173, 173, 255],
    'deeppink': [255, 20, 147, 255],
    'gray65': [166, 166, 166, 255],
    'gray64': [163, 163, 163, 255],
    'gray67': [171, 171, 171, 255],
    'gray66': [168, 168, 168, 255],
    'gray25': [64, 64, 64, 255],
    'coral': [255, 127, 80, 255],
    'gray63': [161, 161, 161, 255],
    'gray62': [158, 158, 158, 255],
    'goldenrod4': [139, 105, 20, 255],
    'grey35': [89, 89, 89, 255],
    'gray89': [227, 227, 227, 255],
    'goldenrod1': [255, 193, 37, 255],
    'goldenrod2': [238, 180, 34, 255],
    'goldenrod3': [205, 155, 29, 255],
    'springgreen1': [0, 255, 127, 255],
    'springgreen2': [0, 238, 118, 255],
    'springgreen3': [0, 205, 102, 255],
    'springgreen4': [0, 139, 69, 255],
    'mistyrose1': [255, 228, 225, 255],
    'sandybrown': [244, 164, 96, 255],
    'grey30': [77, 77, 77, 255],
    'seashell2': [238, 229, 222, 255],
    'seashell3': [205, 197, 191, 255],
    'tan': [210, 180, 140, 255],
    'seashell1': [255, 245, 238, 255],
    'mistyrose3': [205, 183, 181, 255],
    'magenta': [255, 0, 255, 255],
    'pink': [255, 192, 203, 255],
    'ivory2': [238, 238, 224, 255],
    'ivory1': [255, 255, 240, 255],
    'lightcyan2': [209, 238, 238, 255],
    'mediumseagreen': [60, 179, 113, 255],
    'ivory4': [139, 139, 131, 255],
    'darkorange': [255, 140, 0, 255],
    'powderblue': [176, 224, 230, 255],
    'dodgerblue1': [30, 144, 255, 255],
    'gray95': [242, 242, 242, 255],
    'firebrick1': [255, 48, 48, 255],
    'gray7': [18, 18, 18, 255],
    'mistyrose4': [139, 125, 123, 255],
    'tomato': [255, 99, 71, 255],
    'indianred2': [238, 99, 99, 255],
    'steelblue2': [92, 172, 238, 255],
    'gray100': [255, 255, 255, 255],
    'seashell4': [139, 134, 130, 255],
    'grey89': [227, 227, 227, 255],
    'grey88': [224, 224, 224, 255],
    'grey87': [222, 222, 222, 255],
    'grey86': [219, 219, 219, 255],
    'grey85': [217, 217, 217, 255],
    'grey84': [214, 214, 214, 255],
    'midnightblue': [25, 25, 112, 255],
    'grey82': [209, 209, 209, 255],
    'grey81': [207, 207, 207, 255],
    'yellow3': [205, 205, 0, 255],
    'ivory3': [205, 205, 193, 255],
    'grey22': [56, 56, 56, 255],
    'gray85': [217, 217, 217, 255],
    'violetred3': [205, 50, 120, 255],
    'dodgerblue2': [28, 134, 238, 255],
    'gray42': [107, 107, 107, 255],
    'sienna2': [238, 121, 66, 255],
    'grey72': [184, 184, 184, 255],
    'grey73': [186, 186, 186, 255],
    'grey70': [179, 179, 179, 255],
    'palevioletred': [219, 112, 147, 255],
    'lightslategray': [119, 136, 153, 255],
    'grey77': [196, 196, 196, 255],
    'grey74': [189, 189, 189, 255],
    'slategray1': [198, 226, 255, 255],
    'pink1': [255, 181, 197, 255],
    'mediumpurple1': [171, 130, 255, 255],
    'pink3': [205, 145, 158, 255],
    'antiquewhite4': [139, 131, 120, 255],
    'lightpink1': [255, 174, 185, 255],
    'honeydew2': [224, 238, 224, 255],
    'khaki4': [139, 134, 78, 255],
    'darkolivegreen4': [110, 139, 61, 255],
    'gray45': [115, 115, 115, 255],
    'slategray3': [159, 182, 205, 255],
    'darkolivegreen1': [202, 255, 112, 255],
    'khaki1': [255, 246, 143, 255],
    'khaki2': [238, 230, 133, 255],
    'khaki3': [205, 198, 115, 255],
    'lavenderblush': [255, 240, 245, 255],
    'honeydew4': [131, 139, 131, 255],
    'salmon3': [205, 112, 84, 255],
    'salmon2': [238, 130, 98, 255],
    'gray92': [235, 235, 235, 255],
    'salmon4': [139, 76, 57, 255],
    'gray49': [125, 125, 125, 255],
    'gray48': [122, 122, 122, 255],
    'linen': [250, 240, 230, 255],
    'burlywood1': [255, 211, 155, 255],
    'green': [0, 255, 0, 255],
    'gray47': [120, 120, 120, 255],
    'blueviolet': [138, 43, 226, 255],
    'brown2': [238, 59, 59, 255],
    'brown3': [205, 51, 51, 255],
    'peachpuff': [255, 218, 185, 255],
    'brown4': [139, 35, 35, 255],
    'firebrick4': [139, 26, 26, 255],
    'azure1': [240, 255, 255, 255],
    'azure3': [193, 205, 205, 255],
    'azure2': [224, 238, 238, 255],
    'azure4': [131, 139, 139, 255],
    'tomato4': [139, 54, 38, 255],
    'orange4': [139, 90, 0, 255],
    'firebrick': [178, 34, 34, 255],
    'indianred': [205, 92, 92, 255],
    'orange1': [255, 165, 0, 255],
    'orange3': [205, 133, 0, 255],
    'orange2': [238, 154, 0, 255],
    'darkolivegreen': [85, 107, 47, 255],
    'gray2': [5, 5, 5, 255],
    'slategrey': [112, 128, 144, 255],
    'gray81': [207, 207, 207, 255],
    'darkred': [139, 0, 0, 255],
    'gray3': [8, 8, 8, 255],
    'lightsteelblue1': [202, 225, 255, 255],
    'lightsteelblue2': [188, 210, 238, 255],
    'lightsteelblue3': [162, 181, 205, 255],
    'lightsteelblue4': [110, 123, 139, 255],
    'tomato3': [205, 79, 57, 255],
    'gray43': [110, 110, 110, 255],
    'darkgoldenrod4': [139, 101, 8, 255],
    'grey50': [127, 127, 127, 255],
    'yellow4': [139, 139, 0, 255],
    'mediumorchid': [186, 85, 211, 255],
    'yellow2': [238, 238, 0, 255],
    'darkgoldenrod2': [238, 173, 14, 255],
    'darkgoldenrod3': [205, 149, 12, 255],
    'chartreuse': [127, 255, 0, 255],
    'mediumblue': [0, 0, 205, 255],
    'gray4': [10, 10, 10, 255],
    'springgreen': [0, 255, 127, 255],
    'orange': [255, 165, 0, 255],
    'gray5': [13, 13, 13, 255],
    'lightsalmon': [255, 160, 122, 255],
    'gray19': [48, 48, 48, 255],
    'turquoise': [64, 224, 208, 255],
    'lightseagreen': [32, 178, 170, 255],
    'grey8': [20, 20, 20, 255],
    'grey9': [23, 23, 23, 255],
    'grey6': [15, 15, 15, 255],
    'grey7': [18, 18, 18, 255],
    'grey4': [10, 10, 10, 255],
    'grey5': [13, 13, 13, 255],
    'grey2': [5, 5, 5, 255],
    'grey3': [8, 8, 8, 255],
    'grey0': [0, 0, 0, 255],
    'grey1': [3, 3, 3, 255],
    'gray50': [127, 127, 127, 255],
    'goldenrod': [218, 165, 32, 255],
    'grey58': [148, 148, 148, 255],
    'grey59': [150, 150, 150, 255],
    'gray51': [130, 130, 130, 255],
    'grey54': [138, 138, 138, 255],
    'mediumorchid4': [122, 55, 139, 255],
    'grey56': [143, 143, 143, 255],
    'navajowhite3': [205, 179, 139, 255],
    'mediumorchid1': [224, 102, 255, 255],
    'grey51': [130, 130, 130, 255],
    'mediumorchid3': [180, 82, 205, 255],
    'mediumorchid2': [209, 95, 238, 255],
    'cyan2': [0, 238, 238, 255],
    'cyan3': [0, 205, 205, 255],
    'gray23': [59, 59, 59, 255],
    'cyan1': [0, 255, 255, 255],
    'darkgreen': [0, 100, 0, 255],
    'gray24': [61, 61, 61, 255],
    'cyan4': [0, 139, 139, 255],
    'darkviolet': [148, 0, 211, 255],
    'peachpuff4': [139, 119, 101, 255],
    'gray28': [71, 71, 71, 255],
    'slateblue4': [71, 60, 139, 255],
    'slateblue3': [105, 89, 205, 255],
    'peachpuff1': [255, 218, 185, 255],
    'peachpuff2': [238, 203, 173, 255],
    'peachpuff3': [205, 175, 149, 255],
    'gray29': [74, 74, 74, 255],
    'paleturquoise': [175, 238, 238, 255],
    'darkgray': [169, 169, 169, 255],
    'grey25': [64, 64, 64, 255],
    'darkmagenta': [139, 0, 139, 255],
    'palegoldenrod': [238, 232, 170, 255],
    'grey64': [163, 163, 163, 255],
    'grey12': [31, 31, 31, 255],
    'deeppink3': [205, 16, 118, 255],
    'gray79': [201, 201, 201, 255],
    'gray83': [212, 212, 212, 255],
    'deeppink2': [238, 18, 137, 255],
    'burlywood4': [139, 115, 85, 255],
    'palevioletred4': [139, 71, 93, 255],
    'deeppink1': [255, 20, 147, 255],
    'slateblue2': [122, 103, 238, 255],
    'grey46': [117, 117, 117, 255],
    'royalblue4': [39, 64, 139, 255],
    'yellowgreen': [154, 205, 50, 255],
    'royalblue1': [72, 118, 255, 255],
    'slateblue1': [131, 111, 255, 255],
    'lightgoldenrod3': [205, 190, 112, 255],
    'lightgoldenrod2': [238, 220, 130, 255],
    'navy': [0, 0, 128, 255],
    'orchid': [218, 112, 214, 255],
    'ghostwhite': [248, 248, 255, 255],
    'purple': [160, 32, 240, 255],
    'darkkhaki': [189, 183, 107, 255],
    'grey45': [115, 115, 115, 255],
    'gray94': [240, 240, 240, 255],
    'wheat4': [139, 126, 102, 255],
    'gray96': [245, 245, 245, 255],
    'gray97': [247, 247, 247, 255],
    'wheat1': [255, 231, 186, 255],
    'gray91': [232, 232, 232, 255],
    'wheat3': [205, 186, 150, 255],
    'wheat2': [238, 216, 174, 255],
    'indianred4': [139, 58, 58, 255],
    'coral2': [238, 106, 80, 255],
    'coral1': [255, 114, 86, 255],
    'violetred': [208, 32, 144, 255],
    'rosybrown3': [205, 155, 155, 255],
    'deepskyblue2': [0, 178, 238, 255],
    'deepskyblue1': [0, 191, 255, 255],
    'bisque': [255, 228, 196, 255],
    'grey49': [125, 125, 125, 255],
    'khaki': [240, 230, 140, 255],
    'wheat': [245, 222, 179, 255],
    'lightslateblue': [132, 112, 255, 255],
    'mediumpurple3': [137, 104, 205, 255],
    'gray55': [140, 140, 140, 255],
    'deepskyblue': [0, 191, 255, 255],
    'gray98': [250, 250, 250, 255],
    'steelblue': [70, 130, 180, 255],
    'aliceblue': [240, 248, 255, 255],
    'lightskyblue2': [164, 211, 238, 255],
    'lightskyblue3': [141, 182, 205, 255],
    'lightslategrey': [119, 136, 153, 255],
    'blue3': [0, 0, 205, 255],
    'blue2': [0, 0, 238, 255],
    'gainsboro': [220, 220, 220, 255],
    'grey76': [194, 194, 194, 255],
    'purple3': [125, 38, 205, 255],
    'plum4': [139, 102, 139, 255],
    'gray56': [143, 143, 143, 255],
    'plum3': [205, 150, 205, 255],
    'plum': [221, 160, 221, 255],
    'lightgrey': [211, 211, 211, 255],
    'mediumslateblue': [123, 104, 238, 255],
    'mistyrose': [255, 228, 225, 255],
    'lightcyan1': [224, 255, 255, 255],
    'grey71': [181, 181, 181, 255],
    'darksalmon': [233, 150, 122, 255],
    'beige': [245, 245, 220, 255],
    'grey24': [61, 61, 61, 255],
    'azure': [240, 255, 255, 255],
    'honeydew1': [240, 255, 240, 255],
    'slategray2': [185, 211, 238, 255],
    'dodgerblue3': [24, 116, 205, 255],
    'slategray4': [108, 123, 139, 255],
    'grey27': [69, 69, 69, 255],
    'lightcyan3': [180, 205, 205, 255],
    'cornsilk': [255, 248, 220, 255],
    'tomato1': [255, 99, 71, 255],
    'gray57': [145, 145, 145, 255],
    'mediumvioletred': [199, 21, 133, 255],
    'tomato2': [238, 92, 66, 255],
    'snow4': [139, 137, 137, 255],
    'grey75': [191, 191, 191, 255],
    'snow2': [238, 233, 233, 255],
    'snow3': [205, 201, 201, 255],
    'snow1': [255, 250, 250, 255],
    'grey23': [59, 59, 59, 255],
    'cornsilk3': [205, 200, 177, 255],
    'lightcoral': [240, 128, 128, 255],
    'orangered': [255, 69, 0, 255],
    'navajowhite': [255, 222, 173, 255],
    'mediumpurple2': [159, 121, 238, 255],
    'slategray': [112, 128, 144, 255],
    'pink2': [238, 169, 184, 255],
    'grey29': [74, 74, 74, 255],
    'grey28': [71, 71, 71, 255],
    'gray82': [209, 209, 209, 255],
    'burlywood': [222, 184, 135, 255],
    'mediumpurple4': [93, 71, 139, 255],
    'mediumspringgreen': [0, 250, 154, 255],
    'grey26': [66, 66, 66, 255],
    'grey21': [54, 54, 54, 255],
    'grey20': [51, 51, 51, 255],
    'blanchedalmond': [255, 235, 205, 255],
    'pink4': [139, 99, 108, 255],
    'gray78': [199, 199, 199, 255],
    'tan3': [205, 133, 63, 255],
    'gray76': [194, 194, 194, 255],
    'gray77': [196, 196, 196, 255],
    'white': [255, 255, 255, 255],
    'gray75': [191, 191, 191, 255],
    'gray72': [184, 184, 184, 255],
    'gray73': [186, 186, 186, 255],
    'gray70': [179, 179, 179, 255],
    'gray71': [181, 181, 181, 255],
    'lightgray': [211, 211, 211, 255],
    'ivory': [255, 255, 240, 255],
    'gray46': [117, 117, 117, 255],
    'gray74': [189, 189, 189, 255],
    'lightyellow3': [205, 205, 180, 255],
    'lightpink2': [238, 162, 173, 255],
    'lightpink3': [205, 140, 149, 255],
    'paleturquoise4': [102, 139, 139, 255],
    'lightpink4': [139, 95, 101, 255],
    'paleturquoise3': [150, 205, 205, 255],
    'seagreen4': [46, 139, 87, 255],
    'seagreen3': [67, 205, 128, 255],
    'seagreen2': [78, 238, 148, 255],
    'seagreen1': [84, 255, 159, 255],
    'paleturquoise2': [174, 238, 238, 255],
    'gray52': [133, 133, 133, 255],
    'cornsilk4': [139, 136, 120, 255],
    'cornsilk2': [238, 232, 205, 255],
    'darkolivegreen3': [162, 205, 90, 255],
    'cornsilk1': [255, 248, 220, 255],
    'limegreen': [50, 205, 50, 255],
    'darkolivegreen2': [188, 238, 104, 255],
    'grey': [190, 190, 190, 255],
    'violetred2': [238, 58, 140, 255],
    'salmon1': [255, 140, 105, 255],
    'grey92': [235, 235, 235, 255],
    'grey93': [237, 237, 237, 255],
    'grey94': [240, 240, 240, 255],
    'grey95': [242, 242, 242, 255],
    'grey96': [245, 245, 245, 255],
    'grey83': [212, 212, 212, 255],
    'grey98': [250, 250, 250, 255],
    'lightgoldenrod1': [255, 236, 139, 255],
    'palegreen1': [154, 255, 154, 255],
    'red3': [205, 0, 0, 255],
    'palegreen3': [124, 205, 124, 255],
    'palegreen2': [144, 238, 144, 255],
    'palegreen4': [84, 139, 84, 255],
    'cadetblue': [95, 158, 160, 255],
    'violet': [238, 130, 238, 255],
    'mistyrose2': [238, 213, 210, 255],
    'slateblue': [106, 90, 205, 255],
    'grey43': [110, 110, 110, 255],
    'grey90': [229, 229, 229, 255],
    'gray35': [89, 89, 89, 255],
    'turquoise3': [0, 197, 205, 255],
    'turquoise2': [0, 229, 238, 255],
    'burlywood3': [205, 170, 125, 255],
    'burlywood2': [238, 197, 145, 255],
    'lightcyan4': [122, 139, 139, 255],
    'rosybrown': [188, 143, 143, 255],
    'turquoise4': [0, 134, 139, 255],
    'whitesmoke': [245, 245, 245, 255],
    'lightblue': [173, 216, 230, 255],
    'grey40': [102, 102, 102, 255],
    'gray40': [102, 102, 102, 255],
    'honeydew3': [193, 205, 193, 255],
    'dimgray': [105, 105, 105, 255],
    'grey47': [120, 120, 120, 255],
    'seagreen': [46, 139, 87, 255],
    'red4': [139, 0, 0, 255],
    'grey14': [36, 36, 36, 255],
    'snow': [255, 250, 250, 255],
    'darkorchid1': [191, 62, 255, 255],
    'gray58': [148, 148, 148, 255],
    'gray59': [150, 150, 150, 255],
    'cadetblue4': [83, 134, 139, 255],
    'cadetblue3': [122, 197, 205, 255],
    'cadetblue2': [142, 229, 238, 255],
    'cadetblue1': [152, 245, 255, 255],
    'olivedrab4': [105, 139, 34, 255],
    'purple4': [85, 26, 139, 255],
    'gray20': [51, 51, 51, 255],
    'grey44': [112, 112, 112, 255],
    'purple1': [155, 48, 255, 255],
    'olivedrab1': [192, 255, 62, 255],
    'olivedrab2': [179, 238, 58, 255],
    'olivedrab3': [154, 205, 50, 255],
    'orangered3': [205, 55, 0, 255],
    'orangered2': [238, 64, 0, 255],
    'orangered1': [255, 69, 0, 255],
    'darkorchid': [153, 50, 204, 255],
    'thistle3': [205, 181, 205, 255],
    'thistle2': [238, 210, 238, 255],
    'thistle1': [255, 225, 255, 255],
    'salmon': [250, 128, 114, 255],
    'gray93': [237, 237, 237, 255],
    'thistle4': [139, 123, 139, 255],
    'gray39': [99, 99, 99, 255],
    'lawngreen': [124, 252, 0, 255],
    'hotpink3': [205, 96, 144, 255],
    'hotpink2': [238, 106, 167, 255],
    'hotpink1': [255, 110, 180, 255],
    'lightgreen': [144, 238, 144, 255],
    'hotpink4': [139, 58, 98, 255],
    'darkseagreen4': [105, 139, 105, 255],
    'darkseagreen3': [155, 205, 155, 255],
    'darkseagreen2': [180, 238, 180, 255],
    'darkseagreen1': [193, 255, 193, 255],
    'deepskyblue4': [0, 104, 139, 255],
    'gray44': [112, 112, 112, 255],
    'navyblue': [0, 0, 128, 255],
    'darkblue': [0, 0, 139, 255],
    'forestgreen': [34, 139, 34, 255],
    'gray53': [135, 135, 135, 255],
    'grey100': [255, 255, 255, 255],
    'brown1': [255, 64, 64, 255],
};

var $builtinmodule = function (name) {
    var mod = {};
    for (k in PygameLib.constants) {
        mod[k] = Sk.ffi.remapToPy(PygameLib.constants[k]);
    }

    mod.init = new Sk.builtin.func(pygame_init);
    mod.Surface = Sk.misceval.buildClass(mod, surface$1, 'Surface', []);
    PygameLib.SurfaceType = mod.Surface;
    mod.Color = Sk.misceval.buildClass(mod, color_type_f, 'Color', []);
    PygameLib.ColorType = mod.Color;
    mod.Rect = Sk.misceval.buildClass(mod, rect_type_f, 'Rect', []);
    PygameLib.RectType = mod.Rect;
    mod.quit = new Sk.builtin.func(function () {
        PygameLib.running = false;
        pygameCleanup(Sk.pygameData.mainSurface,{
            mouse: mouseEventListener,
            key: keyEventListener
        });
        if (Sk.quitHandler) {
            Sk.quitHandler();
        }
    });
    mod.error = new Sk.builtin.func(function (description) {
        if (Sk.abstr.typeName(description) !== "str") {
            throw new Sk.builtin.TypeError("Error description should be a string");
        }
        mod.lastError = description;
        return new Sk.builtin.RuntimeError(description);
    });
    mod.get_error = new Sk.builtin.func(function () {
        throw new Sk.builtin.NotImplementedError("Not yet implemented");
    });
    mod.set_error = new Sk.builtin.func(function () {
        throw new Sk.builtin.NotImplementedError("Not yet implemented");
    });
    mod.get_sdl_version = new Sk.builtin.func(function () {
        return new Sk.builtin.tuple([1, 2, 15])
    });
    mod.get_sdl_byteorder = new Sk.builtin.func(function () {
        return Sk.ffi.remapToPy(PygameLib.constants.LIL_ENDIAN);
    });
    mod.register_quit = new Sk.builtin.func(function () {
        throw new Sk.builtin.NotImplementedError("Not yet implemented");
    });
    mod.encode_string = new Sk.builtin.func(function () {
        throw new Sk.builtin.NotImplementedError("Not yet implemented");
    });
    mod.encode_file_path = new Sk.builtin.func(function () {
        throw new Sk.builtin.NotImplementedError("Not yet implemented");
    });
    return mod;
};

// pygame module
function pygame_init() {
    // ovo je mi ne izgleda najelegantnije, ali još nisam našao lepši način
    var display_m = Sk.importModule("pygame.display", false, false);
    var event_m = Sk.importModule("pygame.event", false, false);
    var draw_m = Sk.importModule("pygame.draw", false, false);
    var pygame_m = Sk.importModule("pygame", false, false);
    var time_m = Sk.importModule("pygame.time", false, false);
    var image_m = Sk.importModule("pygame.image", false, false);
    var font_m = Sk.importModule("pygame.font", false, false);
    var key_m = Sk.importModule("pygame.key", false, false);
    var version_m = Sk.importModule("pygame.version", false, false);
    var mouse_m = Sk.importModule("pygame.mouse", false, false);
    var transform_m = Sk.importModule("pygame.transform", false, false);
    PygameLib.initial_time = new Date();
    pygame_m.$d['display'] = display_m.$d['display'];
    pygame_m.$d['event'] = display_m.$d['event'];
    pygame_m.$d['draw'] = display_m.$d['draw'];
    pygame_m.$d['image'] = display_m.$d['image'];
    delete PygameLib.eventQueue;
    delete PygameLib.eventTimer;
    PygameLib.eventQueue = [];
    PygameLib.pressedKeys = {}
    PygameLib.eventTimer = {};
    PygameLib.running = true;
    PygameLib.repeatKeys = false;
    PygameLib.mouseData = { "button": [0, 0, 0], "pos": [0, 0], "rel": [0, 0] };
}

var mouseEventListener = function (event) {

    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;
    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.clientX - totalOffsetX;
    canvasY = event.clientY - totalOffsetY;

    var button = event.button;
    if (event.type === "mousedown") {
        var e = [PygameLib.constants.MOUSEBUTTONDOWN,
            {
                key: PygameLib.constants.MOUSEBUTTONDOWN,
                pos: [canvasX, canvasY],
                button: button + 1
            }];
        PygameLib.mouseData["button"][button] = 1;
    } else if (event.type === "mouseup") {
        var e = [PygameLib.constants.MOUSEBUTTONUP,
            {
                key: PygameLib.constants.MOUSEBUTTONUP,
                pos: [canvasX, canvasY],
                button: button + 1 
            }];
        PygameLib.mouseData["button"][button] = 0;
    } else if (event.type === "mousemove") {
        var leftButton = 0;
        var rightButton = 0;
        var middleButton = 0;
        if (event.buttons & (1 << 0)) {
            leftButton = 1;
        }
        if (event.buttons & (1 << 1)) {
            rightButton = 1;
        }
        if (event.buttons & (1 << 2)) {
            middleButton = 1;
        }
        var e = [PygameLib.constants.MOUSEMOTION,
        {
            key: PygameLib.constants.MOUSEMOTION,
            pos: [canvasX, canvasY],
            rel: [event.movementX, event.movementY],
            buttons: [leftButton, middleButton, rightButton]
        }];
        PygameLib.mouseData["pos"] = [canvasX, canvasY];
        PygameLib.mouseData["rel"] = [event.movementX, event.movementY];
    }
    PygameLib.eventQueue.unshift(e);
};

var exitEventListener = function(event) {
    if (PygameLib.eventQueue) {
        var e = [PygameLib.constants.QUIT];
        PygameLib.eventQueue.unshift(e);
    }
}

var pygameCleanup = function $cleanup(self, listeners) {
    if (self) {
        self.main_canvas.removeEventListener('mousedown', listeners.mouse);
        self.main_canvas.removeEventListener('mouseup', listeners.mouse);
        self.main_canvas.removeEventListener('mousemove', listeners.mouse);
        self.exitButton.disabled = true;
        self.exitButton.style.backgroundColor = 'gray';
        self.exitButton.style.borderColor = 'darkgray';
    }
    window.removeEventListener("keydown", listeners.key);
    window.removeEventListener("keyup", listeners.key);
    PygameLib.running = false;
}

// First two are unused from pygame
const FLAG_FULLSCREEN = 0x100;
const FLAG_MAIN = 0x1000;

// Surface((width, height))
var GLOBAL_SURFACE_IDS = 0;
var init$1 = function $__init__123$(self, size, flags, depth, masks) {
    Sk.builtin.pyCheckArgs('__init__', arguments, 2, 5, false, false);
    var tuple_js = Sk.ffi.remapToJs(size);
    self._id = GLOBAL_SURFACE_IDS;
    GLOBAL_SURFACE_IDS += 1;
    self.width = Math.round(tuple_js[0]);
    self.height = Math.round(tuple_js[1]);

    flags = Sk.ffi.remapToJs(flags);
    const main = (flags & FLAG_MAIN) === FLAG_MAIN;
    const fullscreen = (flags & FLAG_FULLSCREEN) === FLAG_FULLSCREEN;

    if (!main) {
        self.main_canvas = document.createElement("canvas");
    } else {
        let consoleLine = Sk.console.pygame(size, fullscreen, self);
        self.main_canvas = consoleLine.canvas;
        Sk.pygameData.mainSurface = self;
        if (!consoleLine.initialized) {
            self.title = document.createElement("div");
            self.title.classList.add("pygame-title-bar");
            // Need to add 2 pixels for 1-pixel border
            self.title.style.width = (2+self.width)+"px";
            // Exit button
            self.exitButton = document.createElement("button");
            self.exitButton.innerHTML = "&times;";
            self.exitButton.classList.add("pygame-title-exit");
            self.exitButton.addEventListener('click', exitEventListener);
            // Title
            self.title.appendChild(self.exitButton);
            self.titleText = document.createElement("span");
            self.titleText.innerText = PygameLib.caption;
            Sk.title_container = self.titleText;
            self.title.appendChild(self.titleText);
            consoleLine.html.prepend(self.title);
            self.main_canvas.addEventListener('mousedown', mouseEventListener);
            self.main_canvas.addEventListener('mouseup', mouseEventListener);
            self.main_canvas.addEventListener('mousemove', mouseEventListener);
            window.addEventListener("keydown", keyEventListener);
            window.addEventListener("keyup", keyEventListener);
            consoleLine.finalize(pygameCleanup, {
                mouse: mouseEventListener,
                key: keyEventListener
            })
            PygameLib.StopPygame = exitEventListener;
        }

        // TODO: Add in title bar, with exit/stop button

        /*if (fullscreen) {
            self.width = window.innerWidth;
            self.height = window.innerHeight;
            self.main_canvas.style["z-index"] = "100";
            self.main_canvas.style["position"] = "absolute";
            self.main_canvas.style["top"] = "0";
            self.main_canvas.style["left"] = "0";
            document.body.appendChild(self.main_canvas);
            window.onresize = function (event) {
                self.width = window.innerWidth;
                self.height = window.innerHeight;
                self.main_canvas.width = self.width;
                self.main_canvas.height = self.height;
                self.main_context.drawImage(self.offscreen_canvas, 0, 0);
                self.offscreen_canvas.width = self.width;
                self.offscreen_canvas.height = self.height;
                self.context2d.drawImage(self.main_canvas, 0, 0);
            };
        } */
    }
    self.main_canvas.width = self.width;
    self.main_canvas.height = self.height;
    self.main_context = self.main_canvas.getContext("2d");

    self.offscreen_canvas = document.createElement('canvas');
    self.context2d = self.offscreen_canvas.getContext("2d");

    self.offscreen_canvas.width = self.width;
    self.offscreen_canvas.height = self.height;
    self.main_canvas.setAttribute('width', self.width);
    self.main_canvas.setAttribute('height', self.height);


    if (main) {
        self.main_canvas.setAttribute('style', "border: 1px solid darkgray;");
        fillWhite(self.main_context, self.main_canvas.width, self.main_canvas.height);
        fillWhite(self.context2d, self.width, self.height);
    } else {
        fillBlack(self.main_context, self.main_canvas.width, self.main_canvas.height);
        fillBlack(self.context2d, self.width, self.height);
    }

    return Sk.builtin.none.none$;

};

function fillBlack(ctx, w, h) {
    ctx.beginPath();
    ctx.rect(0, 0, w - 1, h - 1);
    ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
    ctx.fill();
}

function fillWhite(ctx, w, h) {
    ctx.beginPath();
    ctx.rect(0, 0, w - 1, h - 1);
    ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
    ctx.fill();
}

init$1.co_name = new Sk.builtins['str']('__init__');
init$1.co_varnames = ['self', 'size', 'flags', 'depth', 'masks'];
init$1.$defaults = [new Sk.builtin.int_(0), new Sk.builtin.int_(0), Sk.builtin.none.none$];

var repr$1 = function $__repr__123$(self) {
    var width = Sk.ffi.remapToJs(self.width);
    var height = Sk.ffi.remapToJs(self.height);

    return Sk.ffi.remapToPy('<Surface(' + width + 'x' + height + 'x32 SW)>');
};
repr$1.co_name = new Sk.builtins['str']('__repr__');
repr$1.co_varnames = ['self'];

function get_height(self) {
    Sk.builtin.pyCheckArgs('get_height', arguments, 1, 1, false, false);
    //return Sk.ffi.remapToPy(self.height);
    return new Sk.builtin.int_(self.height);
}

get_height.co_name = new Sk.builtins['str']('get_height');
get_height.co_varnames = ['self'];

function get_width(self) {
    Sk.builtin.pyCheckArgs('get_width', arguments, 1, 1, false, false);
    //return Sk.ffi.remapToPy(self.width);
    return new Sk.builtin.int_(self.width);
}

get_width.co_name = new Sk.builtins['str']('get_width');
get_width.co_varnames = ['self'];

function get_size(self) {
    Sk.builtin.pyCheckArgs('get_size', arguments, 1, 1, false, false);
    return new Sk.builtin.tuple([new Sk.builtin.int_(self.width),
        new Sk.builtin.int_(self.height)]);
}

get_size.co_name = new Sk.builtins['str']('get_size');
get_size.co_varnames = ['self'];

function get_flags() {
    Sk.builtin.pyCheckArgs('get_flags', arguments, 1, 1, false, false);
    return new Sk.builtin.int_(0);
}

get_flags.co_name = new Sk.builtins['str']('get_flags');
get_flags.co_varnames = ['self'];

function update(self, rectangle) {
    // rectangle could be list, single, or missing
    //self.main_canvas.width = self.offscreen_canvas.width;
    //self.main_canvas.height = self.offscreen_canvas.height;
    if (rectangle === undefined) {
        self.main_context.drawImage(self.offscreen_canvas, 0, 0);
        return Sk.builtin.none.none$;
    } else if (Sk.misceval.isTrue(Sk.builtin.isinstance(rectangle, PygameLib.RectType))) {
        rectangle = new Sk.builtin.list([rectangle]);
    }
    // TODO: Make this access the list correctly
    for (let i=0, l= rectangle.v.length; i < l; i+=1) {
        // TODO: Profile this, optimizable hot loop?
        let left = Sk.builtin.getattr(rectangle.v[i], LEFT_STR).v;
        let top = Sk.builtin.getattr(rectangle.v[i], TOP_STR).v;
        let width = Sk.builtin.getattr(rectangle.v[i], WIDTH_STR).v;
        let height = Sk.builtin.getattr(rectangle.v[i], HEIGHT_STR).v;
        self.main_context.drawImage(self.offscreen_canvas,
            left, top, width, height, left, top, width, height);
    }
    return Sk.builtin.none.none$;
}

update.co_name = new Sk.builtins['str']('update');
update.co_varnames = ['self', 'rectangle'];

function blit(self, source, dest, area, flags) {
    var x = Sk.ffi.remapToJs(Sk.abstr.objectGetItem(dest, new Sk.builtin.int_(0)));
    var y = Sk.ffi.remapToJs(Sk.abstr.objectGetItem(dest, new Sk.builtin.int_(1)));
    if (source.offscreen_canvas.width > 0 && source.offscreen_canvas.height > 0) {
        self.context2d.drawImage(source.offscreen_canvas, x, y);
    }
    return PygameLib.make_rect(x, y, source.offscreen_canvas.width, source.offscreen_canvas.height);
}

function convert(self) {
    return self;
}

var surface$1 = function $Surface$class_outer(gbl, loc) {
    loc.__init__ = new Sk.builtins.function(init$1, gbl);
    loc.__repr__ = new Sk.builtins.function(repr$1, gbl);
    loc.fill = new Sk.builtin.func(function (self, color) {
        var ctx = self.context2d;
        var color_js = PygameLib.extract_color(color);
        ctx.fillStyle = 'rgba(' + color_js[0] + ', ' + color_js[1] + ', ' + color_js[2] + ', ' + color_js[3] + ')';
        ctx.fillRect(0, 0, self.width, self.height);
    });
    loc.blit = new Sk.builtins.function(blit, gbl);
    loc.convert = new Sk.builtins.function(convert, gbl);
    loc.convert_alpha = new Sk.builtins.function(convert, gbl);
    loc.update = new Sk.builtins.function(update, gbl);
    loc.get_width = new Sk.builtins.function(get_width, gbl);
    loc.get_height = new Sk.builtins.function(get_height, gbl);
    loc.get_size = new Sk.builtins.function(get_size, gbl);
    loc.get_flags = new Sk.builtins.function(get_flags, gbl);
    loc.set_alpha = new Sk.builtins.function(function (self) {
        // TODO: Finish support for changing alpha of all pixels
    }, gbl);
    loc.copy = new Sk.builtin.func(function (self) {
        var size = new Sk.builtin.tuple([self.offscreen_canvas.width, self.offscreen_canvas.width]);
        var ret = Sk.misceval.callsim(PygameLib.SurfaceType, size);
        ret.offscreen_canvas.width = self.offscreen_canvas.width;
        ret.offscreen_canvas.height = self.offscreen_canvas.height;
        ret.context2d.drawImage(self.offscreen_canvas, 0, 0);
        return ret;
    });
    loc.subsurface = new Sk.builtins.function(function (self, area) {
        // TODO: Implement this properly so it's a reference inside of something else?
        // TODO: Further need to make sure that we are actually accessing using getitem or index whatever
        var x = Sk.ffi.remapToJs(Sk.abstr.objectGetItem(area, new Sk.builtin.int_(0)));
        var y = Sk.ffi.remapToJs(Sk.abstr.objectGetItem(area, new Sk.builtin.int_(1)));
        var w = Sk.ffi.remapToJs(Sk.abstr.objectGetItem(area, new Sk.builtin.int_(2)));
        var h = Sk.ffi.remapToJs(Sk.abstr.objectGetItem(area, new Sk.builtin.int_(3)));
        var size = new Sk.builtin.tuple([w, h]);
        var ret = Sk.misceval.callsim(PygameLib.SurfaceType, size);
        //fillWhite(ret.context2d, w, h);
        ret.offscreen_canvas.width = w;
        ret.offscreen_canvas.height = h;
        ret.context2d.drawImage(self.offscreen_canvas, x, y, w, h, 0, 0, w, h);
        return ret;
    }, gbl);
    loc.scroll = new Sk.builtin.func(function (self, dx, dy) {
        var x = Sk.ffi.remapToJs(dx);
        var y = Sk.ffi.remapToJs(dy);
        self.context2d.drawImage(self.offscreen_canvas, x, y);
        return Sk.builtin.none.none$;
    });
    loc.get_at = new Sk.builtin.func(function (self, coordinates) {
        if (Sk.abstr.typeName(coordinates) !== "tuple") {
            throw new Sk.builtin.TypeError("argument must be a pair");
        }
        var x = Sk.ffi.remapToJs(coordinates.v[0]);
        var y = Sk.ffi.remapToJs(coordinates.v[1]);
        var data = self.context2d.getImageData(x, y, 1, 1).data;
        return new Sk.builtin.tuple([data[0], data[1], data[2], data[3]]);
    });
    loc.set_at = new Sk.builtin.func(function (self, coordinates, clr) {
        if (Sk.abstr.typeName(coordinates) !== "tuple") {
            throw new Sk.builtin.TypeError("the first argument must be a pair");
        }
        if (Sk.abstr.typeName(clr) !== "Color") {
            throw new Sk.builtin.TypeError("the second argument must be a Pygame color");
        }
        var rgba = PygameLib.extract_color(clr);
        self.context2d.fillStyle = "rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + (rgba[3]) + ")";
        var x = Sk.ffi.remapToJs(coordinates.v[0]);
        var y = Sk.ffi.remapToJs(coordinates.v[1]);
        self.context2d.fillRect(x, y, 1, 1);
    });
    loc.get_rect = new Sk.builtin.func(function (self) {
        return PygameLib.make_rect(0, 0, self.offscreen_canvas.width, self.offscreen_canvas.height);
    });
    loc.get_bounding_rect = new Sk.builtin.func(function (self) {
        return PygameLib.make_rect(0, 0, self.offscreen_canvas.width, self.offscreen_canvas.height);
    })
};

surface$1.co_name = new Sk.builtins['str']('Surface');

//pygame.Color
function color_type_f($gbl, $loc) {
    // https://gist.github.com/mjackson/5311256
    $loc.__init__ = new Sk.builtin.func(function (self, r, g, b, a) {
        Sk.builtin.pyCheckArgs('__init__', arguments, 2, 5, false, false);
        var r_js = Sk.ffi.remapToJs(r);
        if (typeof (r_js) == 'string') {
            var color_name = r_js;
            r = Sk.ffi.remapToPy(PygameLib.Colors[color_name][0]);
            g = Sk.ffi.remapToPy(PygameLib.Colors[color_name][1]);
            b = Sk.ffi.remapToPy(PygameLib.Colors[color_name][2]);
            a = Sk.ffi.remapToPy(PygameLib.Colors[color_name][3]);
        }
        Sk.abstr.sattr(self, R_STR, r, false);
        Sk.abstr.sattr(self, G_STR, g, false);
        Sk.abstr.sattr(self, B_STR, b, false);
        Sk.abstr.sattr(self, A_STR, a, false);
        Sk.abstr.sattr(self, Sk.builtin.str.$len, Sk.ffi.remapToPy(4), false);
        return Sk.builtin.none.none$;
    });
    $loc.__init__.co_name = new Sk.builtins['str']('__init__');
    $loc.__init__.co_varnames = ['self', 'r', 'g', 'b', 'a'];

    $loc.__repr__ = new Sk.builtin.func(function (self) {
        var r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false));
        var g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false));
        var b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false));
        var a = Sk.ffi.remapToJs(Sk.abstr.gattr(self, A_STR, false));
        return Sk.ffi.remapToPy('<Color(' + r + ', ' + g + ', ' + b + ', ' + a + ')>');
    });
    $loc.__repr__.co_name = new Sk.builtins['str']('__repr__');
    $loc.__repr__.co_varnames = ['self'];

    var cmy_getter = new Sk.builtin.func(function (self) {
        var r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false));
        var g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false));
        var b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false));
        return new Sk.builtin.tuple([1.0 - r / 255, 1.0 - g / 255, 1.0 - b / 255]);
    });
    var cmy_setter = new Sk.builtin.func(function (self, val) {
        var cmy = Sk.ffi.remapToJs(val);
        Sk.abstr.sattr(self, R_STR, Sk.ffi.remapToPy(255 - cmy[0] * 255), false);
        Sk.abstr.sattr(self, G_STR, Sk.ffi.remapToPy(255 - cmy[1] * 255), false);
        Sk.abstr.sattr(self, B_STR, Sk.ffi.remapToPy(255 - cmy[2] * 255), false);
    });
    // this is a way of creating an equivalent of property()
    $loc.cmy = Sk.misceval.callsimOrSuspend(Sk.builtins.property, cmy_getter, cmy_setter);

    var hsva_getter = new Sk.builtin.func(function (self) {
        // https://stackoverflow.com/a/8023734
        var rr, gg, bb,
            r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false)) / 255,
            g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false)) / 255,
            b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false)) / 255,
            h, s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function (c) {
                return (v - c) / 6 / diff + 1 / 2;
            };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            } else if (g === v) {
                h = (1 / 3) + rr - bb;
            } else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
        }
        var a = Sk.ffi.remapToJs(Sk.abstr.gattr(self, A_STR, false));
        a = Math.round(a / 255 * 100);
        return new Sk.builtin.tuple([Math.round(h * 360), Math.round(s * 100), Math.round(v * 100), a]);
    });
    var hsva_setter = new Sk.builtin.func(function (self, val) {
        // https://stackoverflow.com/a/17243070
        var r, g, b, i, f, p, q, t;
        var hsva = Sk.ffi.remapToJs(val);
        var h = hsva[0] / 360;
        var s = hsva[1] / 100;
        var v = hsva[2] / 100;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        Sk.abstr.sattr(self, R_STR, Sk.ffi.remapToPy(Math.round(r * 255)), false);
        Sk.abstr.sattr(self, G_STR, Sk.ffi.remapToPy(Math.round(g * 255)), false);
        Sk.abstr.sattr(self, B_STR, Sk.ffi.remapToPy(Math.round(b * 255)), false);
        Sk.abstr.sattr(self, A_STR, Sk.ffi.remapToPy(Math.round(hsva[3] / 100 * 255)), false);
    });
    $loc.hsva = Sk.misceval.callsimOrSuspend(Sk.builtins.property, hsva_getter, hsva_setter);

    var hsla_getter = new Sk.builtin.func(function (self) {
        var r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false));
        var g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false));
        var b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false));
        var a = Sk.ffi.remapToJs(Sk.abstr.gattr(self, A_STR, false));
        r /= 255;
        g /= 255;
        b /= 255;
        a /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }
        h *= 360;
        s *= 100;
        l *= 100;
        a *= 100;
        return new Sk.builtin.tuple([h, s, l, a]);
    });
    var hsla_setter = new Sk.builtin.func(function (self, val) {
        var hsla = Sk.ffi.remapToJs(val);
        var h = hsla[0] / 360;
        var s = hsla[1] / 100;
        var l = hsla[2] / 100;
        var a = hsla[3] / 100;
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        Sk.abstr.sattr(self, R_STR, Sk.ffi.remapToPy(Math.round(r * 255)), false);
        Sk.abstr.sattr(self, G_STR, Sk.ffi.remapToPy(Math.round(g * 255)), false);
        Sk.abstr.sattr(self, B_STR, Sk.ffi.remapToPy(Math.round(b * 255)), false);
        Sk.abstr.sattr(self, A_STR, Sk.ffi.remapToPy(Math.round(a * 255)), false);
    });
    $loc.hsla = Sk.misceval.callsimOrSuspend(Sk.builtins.property, hsla_getter, hsla_setter);

    var i1i2i3_getter = new Sk.builtin.func(function (self) {
        var r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false));
        var g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false));
        var b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false));
        r /= 255;
        g /= 255;
        b /= 255;
        var i1 = (r + g + b) / 3;
        var i2 = (r - b) / 2;
        var i3 = (2 * g - r - b) / 4;
        return new Sk.builtin.tuple([i1, i2, i3]);
    });
    var i1i2i3_setter = new Sk.builtin.func(function (self, val) {
        var i1i2i3 = Sk.ffi.remapToJs(val);
        var i1 = i1i2i3[0];
        var i2 = i1i2i3[1];
        var i3 = i1i2i3[2];
        var r = i1 + i2 - 2 * i3 / 3;
        var g = i1 + 4 * i3 / 3;
        var b = i1 - i2 - 2 * i3 / 3;
        Sk.abstr.sattr(self, R_STR, Sk.ffi.remapToPy(Math.round(r * 255)), false);
        Sk.abstr.sattr(self, G_STR, Sk.ffi.remapToPy(Math.round(g * 255)), false);
        Sk.abstr.sattr(self, B_STR, Sk.ffi.remapToPy(Math.round(b * 255)), false);
    });
    $loc.i1i2i3 = Sk.misceval.callsimOrSuspend(Sk.builtins.property, i1i2i3_getter, i1i2i3_setter);

    $loc.normalize = new Sk.builtin.func(function (self) {
        var r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false));
        var g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false));
        var b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false));
        var a = Sk.ffi.remapToJs(Sk.abstr.gattr(self, A_STR, false));
        return new Sk.builtin.tuple([r / 255, g / 255, b / 255, a / 255]);
    });

    $loc.correct_gamma = new Sk.builtin.func(function (self, val) {
        var gamma = Sk.ffi.remapToJs(val);
        var r = Sk.ffi.remapToJs(Sk.abstr.gattr(self, R_STR, false));
        var g = Sk.ffi.remapToJs(Sk.abstr.gattr(self, G_STR, false));
        var b = Sk.ffi.remapToJs(Sk.abstr.gattr(self, B_STR, false));
        var a = Sk.ffi.remapToJs(Sk.abstr.gattr(self, A_STR, false));
        r = Math.round(Math.pow(r / 255, gamma) * 255);
        g = Math.round(Math.pow(g / 255, gamma) * 255);
        b = Math.round(Math.pow(b / 255, gamma) * 255);
        a = Math.round(Math.pow(a / 255, gamma) * 255);
        Sk.abstr.sattr(self, R_STR, Sk.ffi.remapToPy(r), false);
        Sk.abstr.sattr(self, G_STR, Sk.ffi.remapToPy(g), false);
        Sk.abstr.sattr(self, B_STR, Sk.ffi.remapToPy(b), false);
        Sk.abstr.sattr(self, A_STR, Sk.ffi.remapToPy(a), false);
        return new Sk.builtin.tuple([r, g, b, a])
    });

    $loc.set_length = new Sk.builtin.func(function (self, val) {
        Sk.abstr.sattr(self, Sk.builtin.str.$len, val, false);
    });

    $loc.__len__ = new Sk.builtin.func(function (self) {
        return Sk.abstr.gattr(self, Sk.builtin.str.$len, false);
    })
};

