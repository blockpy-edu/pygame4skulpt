const NAME_STR = new Sk.builtin.str('name');
const SZ_STR = new Sk.builtin.str('sz');
const BOLD_STR = new Sk.builtin.str('bold');
const ITALIC_STR = new Sk.builtin.str('italic');
const UNDERLINE_STR = new Sk.builtin.str('underline');

$builtinmodule = function (name) {
    mod = {};
    mod.__is_initialized = false;
    mod.Font = Sk.misceval.buildClass(mod, font_Font, "FontType", []);
    PygameLib.FontType = mod.Font;
    mod.SysFont = new Sk.builtin.func(function (name, size, bold, italic) {
        var font = Sk.misceval.callsim(PygameLib.FontType, name, size);
        Sk.abstr.sattr(font, NAME_STR, name, false);
        Sk.abstr.sattr(font, SZ_STR, size, false);
        if (bold === undefined) {
            Sk.abstr.sattr(font, BOLD_STR, Sk.ffi.remapToPy(false), false);
        } else {
            Sk.abstr.sattr(font, BOLD_STR, bold, false);
        }
        if (italic === undefined) {
            Sk.abstr.sattr(font, ITALIC_STR, Sk.ffi.remapToPy(false), false);
        } else {
            Sk.abstr.sattr(font, ITALIC_STR, italic, false);
        }
        Sk.abstr.sattr(font, UNDERLINE_STR, Sk.ffi.remapToPy(false), false);
        return font;
    });
    mod.init = new Sk.builtin.func(function () {
        mod.__is_initialized = true;
    });
    mod.quit = new Sk.builtin.func(function () {
        mod.__is_initialized = false;
    });
    mod.get_init = new Sk.builtin.func(function () {
        if (mod.__is_initialized) {
            return Sk.ffi.remapToPy(true);
        }
        return Sk.ffi.remapToPy(false);
    });
    mod.get_default_font = new Sk.builtin.func(function () {
        return Sk.ffi.remapToPy('arial');
    });
    mod.get_fonts = new Sk.builtin.func(function () {
        return Sk.ffi.remapToPy(fonts_osx);
    });
    mod.match_font = new Sk.builtin.func(function () {
        return Sk.builtin.none.none$;
    });
    return mod;
};

function font_Font($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, filename, size) {
        Sk.abstr.sattr(self, NAME_STR, name, false);
        Sk.abstr.sattr(self, SZ_STR, size, false);
        Sk.abstr.sattr(self, BOLD_STR, Sk.ffi.remapToPy(false), false);
        Sk.abstr.sattr(self, ITALIC_STR, Sk.ffi.remapToPy(false), false);
        Sk.abstr.sattr(self, UNDERLINE_STR, Sk.ffi.remapToPy(false), false);
        return Sk.builtin.none.none$;
    });
    $loc.render = new Sk.builtin.func(renderFont, $gbl);
    $loc.render.co_name = new Sk.builtins['str']('render');
    $loc.render.co_varnames = ['self', 'text', 'antialias', 'color', 'background'];
    $loc.render.$defaults = [Sk.builtin.none.none$];

    $loc.size = new Sk.builtin.func(fontSize, $gbl);
    $loc.size.co_name = new Sk.builtins['str']('size');

    $loc.set_underline = new Sk.builtin.func(function (self, bool) {
        Sk.abstr.sattr(self, UNDERLINE_STR, bool, false);
    }, $gbl);
    $loc.get_underline = new Sk.builtin.func(function (self) {
        return Sk.abstr.gattr(self, UNDERLINE_STR, false);
    }, $gbl);

    $loc.set_italic = new Sk.builtin.func(function (self, bool) {
        Sk.abstr.sattr(self, ITALIC_STR, bool, false);
    }, $gbl);
    $loc.get_italic = new Sk.builtin.func(function (self) {
        return Sk.abstr.gattr(self, ITALIC_STR, false);
    }, $gbl);

    $loc.set_bold = new Sk.builtin.func(function (self, bool) {
        Sk.abstr.sattr(self, BOLD_STR, bool, false);
    }, $gbl);
    $loc.get_bold = new Sk.builtin.func(function (self) {
        return Sk.abstr.gattr(self, BOLD_STR, false);
    }, $gbl);
}

function fontSize(self, text) {
    var msg = Sk.ffi.remapToJs(text);
    var h = 1.01 * Sk.ffi.remapToJs(Sk.abstr.gattr(self, SZ_STR, false));
    var fontName = Sk.ffi.remapToJs(Sk.abstr.gattr(self, NAME_STR, false));
    fontName = "" + h + "px " + fontName;
    var bold = Sk.ffi.remapToJs(Sk.abstr.gattr(self, BOLD_STR, false));
    if (bold) {
        fontName = 'bold ' + fontName;
    }
    var italic = Sk.ffi.remapToJs(Sk.abstr.gattr(self, ITALIC_STR, false));
    if (italic) {
        fontName = 'italic ' + fontName;
    }
    var w = 300;

    // Create a dummy canvas in order to exploit its measureText() method
    var t = new Sk.builtin.tuple([w, h]);
    var s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
    var ctx = s.offscreen_canvas.getContext("2d");
    ctx.font = fontName;
    return new Sk.builtin.tuple([ctx.measureText(msg).width, h]);
}

function renderFont(self, text, antialias, color, background) {
    var msg = Sk.ffi.remapToJs(text);
    var STRETCH_CONST = 1.1;
    var h = STRETCH_CONST * Sk.ffi.remapToJs(Sk.abstr.gattr(self, SZ_STR, false));
    var fontName = Sk.ffi.remapToJs(Sk.abstr.gattr(self, NAME_STR, false));
    fontName = "" + h + "px " + fontName;
    var bold = Sk.ffi.remapToJs(Sk.abstr.gattr(self, BOLD_STR, false));
    if (bold) {
        fontName = 'bold ' + fontName;
    }
    var italic = Sk.ffi.remapToJs(Sk.abstr.gattr(self, ITALIC_STR, false));
    if (italic) {
        fontName = 'italic ' + fontName;
    }
    var underline = Sk.ffi.remapToJs(Sk.abstr.gattr(self, UNDERLINE_STR, false));

    var w = 300;

    // Create a dummy canvas in order to exploit its measureText() method
    var t = new Sk.builtin.tuple([w, h]);
    var s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
    var ctx = s.offscreen_canvas.getContext("2d");
    ctx.font = fontName;
    w = ctx.measureText(msg).width;
    console.log(w, h);
    t = new Sk.builtin.tuple([w, h]);

    s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
    ctx = s.offscreen_canvas.getContext("2d");
    if (background !== undefined) {
        var background_js = PygameLib.extract_color(background);
        ctx.fillStyle = 'rgba(' + background_js[0] + ', ' + background_js[1] + ', ' + background_js[2] + ', '
            + background_js[3] + ')';
        ctx.fillRect(0, 0, s.offscreen_canvas.width, s.offscreen_canvas.height);
    }
    ctx.font = fontName;
    var color_js = PygameLib.extract_color(color);
    ctx.fillStyle = 'rgba(' + color_js[0] + ', ' + color_js[1] + ', ' + color_js[2] + ', ' + color_js[3] + ')';
    ctx.fillText(msg, 0, 1 / STRETCH_CONST * h);
    if (underline) {
        ctx.strokeStyle = 'rgba(' + color_js[0] + ', ' + color_js[1] + ', ' + color_js[2] + ', ' + color_js[3] + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h - 1);
        ctx.lineTo(w, h - 1);
        ctx.stroke();
    }
    return s;
}

var fonts_osx = ['applecoloremojiui', 'cochin', 'raanana', 'franklingothicmedium', 'signpainter', 'iowanoldstyle', 'corbel', 'avenir', 'birchstd', 'bitstreamverasansmono', 'sfcompacttext', 'albayan', 'applesdgothicneo', 'damascus', 'malayalammn', 'kohinoortelugu', 'minionpro', 'estrangelomidyat', 'lucidagrandeui', 'hiraginokakugothicpro', 'diwankufi', 'calibri', 'arialnarrow', 'applesdgothicneoi', 'gillsans', 'stixsizefoursym', 'adobehebrew', 'farisi', 'ptsanscaption', 'hiraginomarugothicpron', 'avenirnextcondensed', 'couriernew', 'myriadhebrew', 'hiraginominchopron', 'laomn', 'estrangeloantioch', 'damascuspua', 'hiraginosans', 'avenirnext', 'gohatibebzemen', 'altarikhpua', 'arial', 'itfdevanagari', 'hiraginokakugothicstd', 'adobegaramondpro', 'oratorstd', 'kozukagothicpro', 'skia', 'chaparralpro', 'sfnsdisplaycondensed', 'geezapro', 'lithospro', 'heitisc', 'gujaratimt', 'corsivahebrew', 'hoeflertext', 'athelas', 'lucidagrande', 'timesnewroman', 'decotypenaskhpua', 'webdings', 'inaimathi', 'myriadarabic', 'lettergothicstd', 'kozukagothicpr6n', 'lucidasansunicode', 'geezaprointerface', 'kozukaminchopr6n', 'luminari', 'helveticaneue', 'kailasa', 'helvetica', 'systemfont', 'shreedevanagari714', 'gillsansmt', 'applebraille', 'adobedevanagari', 'krungthep', 'stixgeneral', 'verdana', 'sfcompactdisplay', 'baskerville', 'sertomalankara', 'rockwell', 'newpeninimmt', 'malayalamsangammn', 'palatinolinotype', 'mspmincho', 'euphemiaucas', 'gurmukhisangammn', 'ptsansnarrow', 'trattatello', 'consolas', 'mishafigold', 'arialhebrewscholar', 'pingfangtc', 'symbol', 'ptserif', 'ayuthaya', 'notonastaliqurduui', 'stixintegralsd', 'kohinoordevanagari', 'sertomardin', 'notonastaliqurdu', 'stixnonunicode', 'adobekaitistd', 'pingfangsc', 'pingfanghk', 'stencilstd', 'trebuchetms', 'heititc', 'times', 'kohinoorbangla', 'marlett', 'seravek', 'tamilmn', 'andalemono', 'kufistandardgkpua', 'estrangelotalada', 'meiryo', 'banglasangammn', 'adobeheitistd', 'alnilepua', 'cambria', 'sukhumvitset', 'msmincho', 'marion', 'cooperstd', 'brushscriptmt', 'charter', 'comicsansms', 'sinhalasangammn', 'mingliuhkscs', 'palatino', 'arialroundedmtbold', 'estrangeloquenneshrin', 'ptsans', 'kefa', 'chalkboard', 'arabicuidisplay', 'laosangammn', 'impact', 'luxisans', 'menlo', 'bigcaslon', 'simhei', 'helveticaneuedeskinterface', 'myriadpro', 'snellroundhand', 'stixintegralsup', 'bitstreamverasans', 'arialhebrewdeskinterface', 'adobesongstd', 'stixsizeonesym', 'adobefanheitistd', 'superclarendon', 'sfcompactrounded', 'chalkboardse', 'muna', 'perpetua', 'hiraginokakugothicinterface', 'dinalternate', 'adobenaskh', 'stixintegralssm', 'tahoma', 'luxiserif', 'sertojerusalemoutline', 'telugusangammn', 'arabicuitext', 'sfnstextcondensed', 'adobemingstd', 'twcenmt', 'ptserifcaption', 'kannadasangammn', 'candara', 'americantypewriter', 'msreferencesansserif', 'papyrus', 'hiraginokakugothicpron', 'mishafi', 'futura', 'estrangeloedessa', 'sinhalamn', 'kozukaminchopro', 'albayanpua', 'adobecaslonpro', 'gujaratisangammn', 'trajanpro', 'constantia', 'myanmarsangammn', 'copperplate', 'teamviewer12', 'lucidaconsole', 'chalkduster', 'microsoftyibaiti', 'khmersangammn', 'songtitc', 'microsofttaile', 'bodoni72smallcaps', 'itfdevanagarimarathi', 'hiraginokakugothicstdn', 'oriyamn', 'georgia', 'pmingliuextb', 'nadeempua', 'tektonpro', 'applesymbols', 'markerfelt', 'nuevastd', 'songtisc', 'herculanum', 'optima', 'kufistandardgk', 'ptmono', 'bodoni72', 'adobearabic', 'giddyupstd', 'luximono', 'applechancery', 'khmermn', 'arialunicodems', 'bitstreamveraserif', 'eastsyriacadiabene', 'mspgothic', 'mingliu', 'bodoni72oldstyle', 'devanagarimt', 'sertobatnan', 'aquakana', 'hiraginosansgbinterface', 'mshtakan', 'msgothic', 'blackoakstd', 'bradleyhand', 'estrangelonisibin', 'prestigeelitestd', 'wingdings3', 'wingdings2', 'myanmarmn', 'sertokharput', 'stixsizefivesym', 'gurmukhimn', 'kannadamn', 'munapua', 'devanagarisangammn', 'wingdings', 'dincondensed', 'nadeem', 'sanapua', 'thonburi', 'applemyungjo', 'arialhebrew', 'beirutpua', 'baghdadpua', 'gurmukhimt', 'savoyeletcc', 'geezapropua', 'zapfino', 'telugumn', 'banglamn', 'waseem', 'arialblack', 'sertourhoy', 'charlemagnestd', 'microsoftsansserif', 'gulim', 'savoyelet', 'decotypenaskh', 'batang', 'stsong', 'ocrastd', 'franklingothicbook', 'didot', 'applegothic', 'altarikh', 'adobefangsongstd', 'stixvariants', 'zapfdingbats', 'hiraginosansgb', 'farah', 'baghdad', 'gb18030bitmap', 'kokonor', 'sertojerusalem', 'silom', 'estrangeloturabdin', 'bookshelfsymbol7', 'noteworthy', 'stixsizetwosym', 'oriyasangammn', 'tamilsangammn', 'alnile', 'phosphate', 'cambriamath', 'sana', 'stixintegralsupd', 'simsun', 'sathu', 'estrangelonisibinoutline', 'mingliuextb', 'simsunextb', 'beirut', 'farahpua', 'brushscriptstd', 'eastsyriacctesiphon', 'diwankufipua', 'rosewoodstd', 'mongolianbaiti', 'diwanthuluth', 'stixintegralsupsm', 'gabriola', 'mingliuhkscsextb', 'adobemyungjostd', 'msreferencespecialty', 'keyboard', 'microsofthimalaya', 'mesquitestd', 'poplarstd', 'hiraginomarugothicpro', 'hiraginominchopro', 'hobostd', 'stixsizethreesym', 'bodoniornaments', 'lastresort', 'pmingliu', 'applecoloremoji', 'plantagenetcherokee', 'adobegothicstd'];
