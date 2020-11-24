var $builtinmodule = function (name) {
    mod = {};
    mod.ver = Sk.ffi.remapToPy("1.9.3");
    mod.vernum = new Sk.builtin.tuple([Sk.ffi.remapToPy(1), Sk.ffi.remapToPy(9), Sk.ffi.remapToPy(3)]);
    mod.rev = new Sk.builtin.str("");
    return mod;
};
