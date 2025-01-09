var $builtinmodule = function (name) {
    var mod = {};

    //sprite.Sprite
    //function sprite_Sprite_f($gbl, $loc) {
    //Sprite(*groups) -> Sprite
    $loc.__init__ = new Sk.builtin.func(function (self, groups) {
        Sk.builtin.pyCheckArgs('__init__', arguments, 2, 2, false, false);
        //Sk.abstr.sattr(self, )

        if (Sk.abstr.typeName(a) === "tuple" && Sk.abstr.typeName(b) === "tuple") {
            if (c !== undefined || d !== undefined) {
                throw new Sk.builtin.RuntimeError("Expected 2 tuples or 4 ints as input");
            }
            var a_js = Sk.ffi.remapToJs(a);
            var b_js = Sk.ffi.remapToJs(b);
            Sk.abstr.sattr(self, LEFT_STR, Sk.ffi.remapToPy(a_js[0]), false);
            Sk.abstr.sattr(self, TOP_STR, Sk.ffi.remapToPy(a_js[1]), false);
            Sk.abstr.sattr(self, WIDTH_STR, Sk.ffi.remapToPy(b_js[0]), false);
            Sk.abstr.sattr(self, HEIGHT_STR, Sk.ffi.remapToPy(b_js[1]), false);
        } else if ((Sk.abstr.typeName(a) === "int" || Sk.abstr.typeName(a) === "float") &&
            (Sk.abstr.typeName(b) === "int" || Sk.abstr.typeName(b) === "float") &&
            (Sk.abstr.typeName(c) === "int" || Sk.abstr.typeName(c) === "float") &&
            (Sk.abstr.typeName(d) === "int" || Sk.abstr.typeName(d) === "float")) {
            Sk.abstr.sattr(self, LEFT_STR, a, false);
            Sk.abstr.sattr(self, TOP_STR, b, false);
            Sk.abstr.sattr(self, WIDTH_STR, c, false);
            Sk.abstr.sattr(self, HEIGHT_STR, d, false);
        }
        return Sk.builtin.none.none$;
    });
    $loc.__init__.co_name = new Sk.builtins['str']('__init__');
    $loc.__init__.co_varnames = ['self', 'left', 'top', 'width', 'heght'];

    mod.Sprite = Sk.misceval.buildClass(mod, sprite_Sprite_f, "Sprite", []);
    PygameLib.Sprite = mod.Sprite;
    /*mod.Sprite = new Sk.builtin.func(function (type, dict) {
        return Sk.misceval.callsim(mod.Sprite, type, dict)
    });*/

    return mod;
};