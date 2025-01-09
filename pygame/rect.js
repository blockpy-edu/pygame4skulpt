function makeCoordinate(x, y) {
    return new Sk.builtin.tuple([Sk.ffi.remapToPy(x), Sk.ffi.remapToPy(y)]);
}

//pygame.Rect
function rect_type_f($gbl, $loc) {
    //Rect(Surface, color, Rect, width=0) -> Rect
    //Rect((left, top), (width, height)) -> Rect
    $loc.__init__ = new Sk.builtin.func(function (self, a, b, c, d) {
        Sk.builtin.pyCheckArgs('__init__', arguments, 2, 5, false, false);
        if (arguments.length === 5) {
            Sk.abstr.sattr(self, LEFT_STR, a, false);
            Sk.abstr.sattr(self, TOP_STR, b, false);
            Sk.abstr.sattr(self, WIDTH_STR, c, false);
            Sk.abstr.sattr(self, HEIGHT_STR, d, false);
        } else if (arguments.length === 3) {
            Sk.abstr.sattr(self, LEFT_STR, Sk.abstr.objectGetItem(a, new Sk.builtin.int_(0)), false);
            Sk.abstr.sattr(self, TOP_STR, Sk.abstr.objectGetItem(a, new Sk.builtin.int_(1)), false);
            Sk.abstr.sattr(self, WIDTH_STR, Sk.abstr.objectGetItem(b, new Sk.builtin.int_(0)), false);
            Sk.abstr.sattr(self, HEIGHT_STR, Sk.abstr.objectGetItem(b, new Sk.builtin.int_(1)), false);
        } else if (arguments.length === 2) {
            // TODO: Support 'rect' attribute
            Sk.abstr.sattr(self, LEFT_STR, Sk.abstr.objectGetItem(a, new Sk.builtin.int_(0)), false);
            Sk.abstr.sattr(self, TOP_STR, Sk.abstr.objectGetItem(a, new Sk.builtin.int_(1)), false);
            Sk.abstr.sattr(self, WIDTH_STR, Sk.abstr.objectGetItem(a, new Sk.builtin.int_(2)), false);
            Sk.abstr.sattr(self, HEIGHT_STR, Sk.abstr.objectGetItem(a, new Sk.builtin.int_(3)), false);
        } else {
            throw new Sk.builtin.RuntimeError("Unknown Rect format with "+arguments.length+" arguments.")
        }
        return Sk.builtin.none.none$;
    });
    $loc.__init__.co_name = new Sk.builtins['str']('__init__');
    $loc.__init__.co_varnames = ['self', 'left', 'top', 'width', 'heght'];

    $loc.__repr__ = new Sk.builtin.func(function (self) {
        var left = Sk.ffi.remapToJs(Sk.abstr.gattr(self, LEFT_STR, false));
        var top = Sk.ffi.remapToJs(Sk.abstr.gattr(self, TOP_STR, false));
        var width = Sk.ffi.remapToJs(Sk.abstr.gattr(self, WIDTH_STR, false));
        var height = Sk.ffi.remapToJs(Sk.abstr.gattr(self, HEIGHT_STR, false));
        return Sk.ffi.remapToPy('<Rect(' + left + ', ' + top + ', ' + width + ', ' + height + ')>');
    });
    $loc.__repr__.co_name = new Sk.builtins['str']('__repr__');
    $loc.__repr__.co_varnames = ['self'];

    $loc.__getitem__ = new Sk.builtin.func(function (self, index) {
        switch (Sk.ffi.remapToJs(index)) {
            case 0: return Sk.abstr.gattr(self, LEFT_STR, false);
            case 1: return Sk.abstr.gattr(self, TOP_STR, false);
            case 2: return Sk.abstr.gattr(self, WIDTH_STR, false);
            case 3: return Sk.abstr.gattr(self, HEIGHT_STR, false);
        }
    });

    $loc.copy = new Sk.builtin.func(function (self) {
        var left = Sk.ffi.remapToJs(Sk.abstr.gattr(self, LEFT_STR, false));
        var top = Sk.ffi.remapToJs(Sk.abstr.gattr(self, TOP_STR, false));
        var width = Sk.ffi.remapToJs(Sk.abstr.gattr(self, WIDTH_STR, false));
        var height = Sk.ffi.remapToJs(Sk.abstr.gattr(self, HEIGHT_STR, false));
        return PygameLib.make_rect(left, top, width, height);
    }, $gbl);
    // https://github.com/pygame/pygame/blob/master/src_c/rect.c
    var x_getter = new Sk.builtin.func(function (self) {
        return Sk.abstr.gattr(self, LEFT_STR, false);
    });
    var x_setter = new Sk.builtin.func(function (self, val) {
        Sk.abstr.sattr(self, LEFT_STR, val, false);
    });
    $loc.x = Sk.misceval.callsimOrSuspend(Sk.builtins.property, x_getter, x_setter);

    var y_getter = new Sk.builtin.func(function (self) {
        return Sk.abstr.gattr(self, TOP_STR, false);
    });
    var y_setter = new Sk.builtin.func(function (self, val) {

        Sk.abstr.sattr(self, TOP_STR, val, false);
    });
    $loc.y = Sk.misceval.callsimOrSuspend(Sk.builtins.property, y_getter, y_setter);

    function get_top(self) {
        return Sk.ffi.remapToJs(Sk.abstr.gattr(self, TOP_STR, false));
    }

    function get_height(self) {
        return Sk.ffi.remapToJs(Sk.abstr.gattr(self, HEIGHT_STR, false));
    }

    function get_bottom(self) {
        return get_top(self) + get_height(self);
    }

    function get_left(self) {
        return Sk.ffi.remapToJs(Sk.abstr.gattr(self, LEFT_STR, false));
    }

    function get_width(self) {
        return Sk.ffi.remapToJs(Sk.abstr.gattr(self, WIDTH_STR, false));
    }

    function get_right(self) {
        return get_left(self) + get_width(self);
    }

    function get_centerx(self) {
        return get_left(self) + Math.floor(get_width(self) / 2);
    }

    function get_centery(self) {
        return get_top(self) + Math.floor(get_height(self) / 2);
    }

    function set_top(self, t) {
        Sk.abstr.sattr(self, TOP_STR, Sk.ffi.remapToPy(t), false);
    }

    function set_height(self, h) {
        Sk.abstr.sattr(self, HEIGHT_STR, Sk.ffi.remapToPy(h), false);
    }

    function set_bottom(self, b) {
        set_top(self, b - get_height(self));
    }

    function set_left(self, l) {
        Sk.abstr.sattr(self, LEFT_STR, Sk.ffi.remapToPy(l), false);
    }

    function set_width(self, w) {
        Sk.abstr.sattr(self, WIDTH_STR, Sk.ffi.remapToPy(w), false);
    }

    function set_right(self, r) {
        set_left(self, r - get_width(self));
    }

    function set_centerx(self, cx) {
        set_left(self, cx - Math.floor(get_width(self) / 2));
    }

    function set_centery(self, cy) {
        set_top(self, cy - Math.floor(get_height(self) / 2));
    }

    var bottom_getter = new Sk.builtin.func(function (self) {
        return Sk.ffi.remapToPy(get_bottom(self));
    });
    var bottom_setter = new Sk.builtin.func(function (self, val) {
        set_bottom(self, Sk.ffi.remapToJs(val));
    });
    $loc.bottom = Sk.misceval.callsimOrSuspend(Sk.builtins.property, bottom_getter, bottom_setter);

    var right_getter = new Sk.builtin.func(function (self) {
        return Sk.ffi.remapToPy(get_right(self));
    });
    var right_setter = new Sk.builtin.func(function (self, val) {
        set_right(self, Sk.ffi.remapToJs(val));
    });
    $loc.right = Sk.misceval.callsimOrSuspend(Sk.builtins.property, right_getter, right_setter);

    var topleft_getter = new Sk.builtin.func(function (self) {

        return makeCoordinate(get_top(self), get_left(self));
    });
    var topleft_setter = new Sk.builtin.func(function (self, val) {
        var tl = Sk.ffi.remapToJs(val);
        set_top(self, tl[0]);
        set_left(self, tl[1]);
    });
    $loc.topleft = Sk.misceval.callsimOrSuspend(Sk.builtins.property, topleft_getter, topleft_setter);

    var bottomleft_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_bottom(self), get_left(self));
    });
    var bottomleft_setter = new Sk.builtin.func(function (self, val) {
        var bl = Sk.ffi.remapToJs(val);
        set_bottom(self, bl[0]);
        set_left(self, bl[1]);
    });
    $loc.bottomleft = Sk.misceval.callsimOrSuspend(Sk.builtins.property, bottomleft_getter, bottomleft_setter);

    var topright_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_top(self), get_right(self));
    });
    var topright_setter = new Sk.builtin.func(function (self, val) {
        var tr = Sk.ffi.remapToJs(val);
        set_top(self, tr[0]);
        set_right(self, tr[1]);
    });
    $loc.topright = Sk.misceval.callsimOrSuspend(Sk.builtins.property, topright_getter, topright_setter);

    var bottomright_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_bottom(self), Sk.ffi.remapToPy(get_right(self)));
    });
    var bottomright_setter = new Sk.builtin.func(function (self, val) {
        var br = Sk.ffi.remapToJs(val);
        set_bottom(self, br[0]);
        set_right(self, br[1]);
    });
    $loc.bottomright = Sk.misceval.callsimOrSuspend(Sk.builtins.property, bottomright_getter, bottomright_setter);

    var midtop_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_left(self) + Math.floor(get_width(self) / 2), get_top(self));
    });
    var midtop_setter = new Sk.builtin.func(function (self, val) {
        var mt = Sk.ffi.remapToJs(val);
        set_left(self, mt[0] - Math.floor(get_width(self) / 2));
        set_top(self, mt[1]);
    });
    $loc.midtop = Sk.misceval.callsimOrSuspend(Sk.builtins.property, midtop_getter, midtop_setter);

    var midbottom_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_centerx(self), get_bottom(self))
    });
    var midbottom_setter = new Sk.builtin.func(function (self, val) {
        var mb = Sk.ffi.remapToJs(val);
        set_centerx(self, mb[0]);
        set_bottom(self, mb[1]);
    });
    $loc.midbottom = Sk.misceval.callsimOrSuspend(Sk.builtins.property, midbottom_getter, midbottom_setter);

    var midleft_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_left(self), get_centery(self));
    });
    var midleft_setter = new Sk.builtin.func(function (self, val) {
        var lm = Sk.ffi.remapToJs(val);
        set_left(self, lm[0]);
        set_centery(self, lm[1]);
    });
    $loc.midleft = Sk.misceval.callsimOrSuspend(Sk.builtins.property, midleft_getter, midleft_setter);

    var midright_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_right(self), get_centery(self));
    });
    var midright_setter = new Sk.builtin.func(function (self, val) {
        var rm = Sk.ffi.remapToJs(val);
        set_right(self, rm[0]);
        set_centery(self, rm[1]);
    });
    $loc.midright = Sk.misceval.callsimOrSuspend(Sk.builtins.property, midright_getter, midright_setter);

    var center_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_centerx(self), get_centery(self));
    });
    var center_setter = new Sk.builtin.func(function (self, val) {
        var c = Sk.ffi.remapToJs(val);
        set_centerx(self, c[0]);
        set_centery(self, c[1]);
    });
    $loc.center = Sk.misceval.callsimOrSuspend(Sk.builtins.property, center_getter, center_setter);

    var centerx_getter = new Sk.builtin.func(function (self) {
        return Sk.ffi.remapToPy(get_centerx(self));
    });
    var centerx_setter = new Sk.builtin.func(function (self, val) {
        set_centerx(self, Sk.ffi.remapToJs(val));
    });
    $loc.centerx = Sk.misceval.callsimOrSuspend(Sk.builtins.property, centerx_getter, centerx_setter);

    var centery_getter = new Sk.builtin.func(function (self) {
        return Sk.ffi.remapToPy(get_centery(self));
    });
    var centery_setter = new Sk.builtin.func(function (self) {
        set_centery(self, Sk.ffi.remapToPy(val));
    });
    $loc.centery = Sk.misceval.callsimOrSuspend(Sk.builtins.property, centery_getter, centery_setter);

    var size_getter = new Sk.builtin.func(function (self) {
        return makeCoordinate(get_width(self), get_height(self));
    });
    var size_setter = new Sk.builtin.func(function (self, val) {
        var s = Sk.ffi.remapToJs(val);
        set_width(self, s[0]);
        set_height(self, s[1]);
    });
    $loc.size = Sk.misceval.callsimOrSuspend(Sk.builtins.property, size_getter, size_setter);

    var w_getter = new Sk.builtin.func(function (self) {
        return Sk.ffi.remapToPy(get_width(self));
    });
    var w_setter = new Sk.builtin.func(function (self, val) {
        set_width(self, Sk.ffi.remapToJs(val));
    });
    $loc.w = Sk.misceval.callsimOrSuspend(Sk.builtins.property, w_getter, w_setter);

    var h_getter = new Sk.builtin.func(function (self) {
        return Sk.ffi.remapToPy(get_height(self));
    });
    var h_setter = new Sk.builtin.func(function (self, val) {
        set_height(self, Sk.ffi.remapToJs(val));
    });
    $loc.h = Sk.misceval.callsimOrSuspend(Sk.builtins.property, h_getter, h_setter);

    $loc.move = new Sk.builtin.func(function (self, x, y) {
        var newLeft = get_left(self) + Sk.ffi.remapToJs(x);
        var newTop = get_top(self) + Sk.ffi.remapToJs(y);
        return PygameLib.make_rect(newLeft, newTop, get_width(self), get_height(self));
    });
    $loc.move_ip = new Sk.builtin.func(function (self, x, y) {
        set_left(self, get_left(self) + Sk.ffi.remapToJs(x));
        set_top(self, get_top(self) + Sk.ffi.remapToJs(y));
        return Sk.builtin.none.none$;
    });
    $loc.inflate = new Sk.builtin.func(function (self, x, y) {
        x = Sk.ffi.remapToJs(x);
        y = Sk.ffi.remapToJs(y);
        var newLeft = get_left(self) - Math.floor(x / 2);
        var newTop = get_top(self) - Math.floor(y / 2);
        return PygameLib.make_rect(newLeft, newTop, get_width(self)+x, get_height(self)+y);
    });
    $loc.inflate_ip = new Sk.builtin.func(function (self, x, y) {
        x = Sk.ffi.remapToJs(x);
        y = Sk.ffi.remapToJs(y);
        var newLeft = get_left(self) - Math.floor(x / 2);
        var newTop = get_top(self) - Math.floor(y / 2);
        set_left(self, newLeft);
        set_top(self, newTop);
        set_width(self, get_width(self) + x);
        set_height(self, get_height(self) + y);
    });
    $loc.clamp = new Sk.builtin.func(function (self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var x, y;
        if (selfw >= argw) {
            x = argx + argw / 2 - selfw / 2;
        }
        else if (selfx < argx) {

            x = argx;
        }
        else if (selfx + selfw > argx + argw) {
            x = argx + argw - selfw;
        }
        else {
            x = selfx;
        }

        if (selfh >= argh) {
            y = argy + argh / 2 - selfh / 2;
        }
        else if (selfy < argy) {
            y = argy;
        }
        else if (selfy + selfh > argy + argh) {
            y = argy + argh - selfh;
        }
        else {
            y = selfy;
        }
        return PygameLib.make_rect(x, y, selfw, selfh);
    });
    $loc.clamp_ip = new Sk.builtin.func(function (self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var x, y;
        if (selfw >= argw) {
            x = argx + argw / 2 - selfw / 2;
        }
        else if (selfx < argx) {

            x = argx;
        }
        else if (selfx + selfw > argx + argw) {
            x = argx + argw - selfw;
        }
        else {
            x = selfx;
        }

        if (selfh >= argh) {
            y = argy + argh / 2 - selfh / 2;
        }
        else if (selfy < argy) {
            y = argy;
        }
        else if (selfy + selfh > argy + argh) {
            y = argy + argh - selfh;
        }
        else {
            y = selfy;
        }
        set_left(self, x);
        set_top(self, y);
    });
    $loc.clip = new Sk.builtin.func(function (self, argrect) {
        if (Sk.abstr.typeName(argrect) !== "Rect") {
            throw new Sk.builtin.TypeError("Argument must be rect style object");
        }
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var x, y, w, h;
        /* Left */
        if ((selfx >= argx) && (selfx < (argx + argw))) {
            x = selfx;
        }
        else if ((argx >= selfx) && (argx < (selfx + selfw))) {
            x = argx;
        }
        else {
            return PygameLib.make_rect(selfx, selfy, 0, 0);
        }
        /* Right */
        if (((selfx + selfw) > argx) && ((selfx + selfw) <= (argx + argw))) {
            w = (selfx + selfw) - x;
        }
        else if (((argx + argw) > selfx) && ((argx + argw) <= (selfx + selfw))) {
            w = (argx + argw) - x;
        }
        else {
            return PygameLib.make_rect(selfx, selfy, 0, 0);
        }
        /* Top */
        if ((selfy >= argy) && (selfy < (argy + argh))) {
            y = selfy;
        } else if ((argy >= selfy) && (argy < (selfy + selfh))) {
            y = argy;
        } else {
            return PygameLib.make_rect(selfx, selfy, 0, 0);
        }
        /* Bottom */
        if (((selfy + selfh) > argy) && ((selfy + selfh) <= (argy + argh))) {
            h = (selfy + selfh) - y;
        } else if (((argy + argh) > selfy) && ((argy + argh) <= (selfy + selfh))) {
            h = (argy + argh) - y;
        } else {
            return PygameLib.make_rect(selfx, selfy, 0, 0);
        }
        return PygameLib.make_rect(x, y, w, h);
    });
    $loc.union = new Sk.builtin.func(function (self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var x, y, w, h;
        x = Math.min(argx, selfx);
        y = Math.min(argy, selfy);
        w = Math.max(selfx + selfw, argx + argw) - x;
        h = Math.max(selfy + selfh, argy + argh) - y;
        return PygameLib.make_rect(x, y, w, h);
    });
    $loc.union_ip = new Sk.builtin.func(function (self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var x, y, w, h;
        x = Math.min(argx, selfx);
        y = Math.min(argy, selfy);
        w = Math.max(selfx + selfw, argx + argw) - x;
        h = Math.max(selfy + selfh, argy + argh) - y;
        set_left(self, x);
        set_top(self, y);
        set_width(self, w);
        set_height(self, h);
    });
    $loc.unionall = new Sk.builtin.func(function (self, list) {
        var l = get_left(self);
        var t = get_top(self);
        var r = l + get_width(self);
        var b = t + get_height(self);
        for (var i = 0; i < list.v.length; i++) {
            l = Math.min(l, get_left(list.v[i]));
            t = Math.min(t, get_top(list.v[i]));
            r = Math.max(r, get_right(list.v[i]));
            b = Math.max(b, get_bottom(list.v[i]));
        }
        return PygameLib.make_rect(l, t, r-l, b-t);
    });
    $loc.unionall_ip = new Sk.builtin.func(function (self, list) {
        var l = get_left(self);
        var t = get_top(self);
        var r = l + get_width(self);
        var b = t + get_height(self);
        for (var i = 0; i < list.v.length; i++) {
            l = Math.min(l, get_left(list.v[i]));
            t = Math.min(t, get_top(list.v[i]));
            r = Math.max(r, get_right(list.v[i]));
            b = Math.max(b, get_bottom(list.v[i]));
        }
        set_left(self, l);
        set_top(self, t);
        set_width(self, r - l);
        set_height(self, b - t);
    });
    $loc.fit = new Sk.builtin.func(function (self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var x, y, w, h;
        var xratio, yratio, maxratio;
        xratio = selfw / argw;
        yratio = selfh / argh;
        maxratio = (xratio > yratio) ? xratio : yratio;

        w = Math.round(selfw / maxratio);
        h = Math.round(selfh / maxratio);

        x = argx + Math.floor((argw - w) / 2);
        y = argy + Math.floor((argh - h) / 2);
        return PygameLib.make_rect(x, y, w, h);
    });
    $loc.normalize = new Sk.builtin.func(function (self) {
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        if (selfw < 0) {
            selfx += selfw;
            selfw = -selfw;
        }
        if (selfh < 0) {
            selfy += selfh;
            selfh = -selfh;
        }
        set_left(self, selfx);
        set_width(self, selfw);
        set_top(self, selfy);
        set_height(self, selfh);
    });
    $loc.contains = new Sk.builtin.func(function (self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var contained = (selfx <= argx) && (selfy <= argy) &&
            (selfx + selfw >= argx + argw) &&
            (selfy + selfh >= argy + argh) &&
            (selfx + selfw > argx) &&
            (selfy + selfh > argy);
        return Sk.ffi.remapToPy(contained);
    });
    $loc.collidepoint = new Sk.builtin.func(function (self, x, y) {
        if (Sk.abstr.typeName(x) === "tuple" && y === undefined) {
            var xy = Sk.ffi.remapToJs(x);
            x = xy[0];
            y = xy[1];
        } else if (Sk.abstr.typeName(x) === "int" && Sk.abstr.typeName(y) === "int") {
            x = Sk.ffi.remapToJs(x);
            y = Sk.ffi.remapToJs(y);
        } else {
            throw new Sk.builtin.TypeError("argument must contain two numbers");
        }
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        var inside = x >= selfx && x < selfx + selfw &&
            y >= selfy && y < selfy + selfh;
        return Sk.ffi.remapToPy(inside);
    });

    function do_rects_intersect(self, argrect) {
        var argx = get_left(argrect);
        var argy = get_top(argrect);
        var argw = get_width(argrect);
        var argh = get_height(argrect);
        var selfx = get_left(self);
        var selfy = get_top(self);
        var selfw = get_width(self);
        var selfh = get_height(self);
        return (selfx < argx + argw && selfy < argy + argh &&
            selfx + selfw > argx && selfy + selfh > argy);
    }

    $loc.colliderect = new Sk.builtin.func(function (self, argrect) {
        if (Sk.abstr.typeName(argrect) !== "Rect") {
            throw new Sk.builtin.TypeError("Argument must be rect style object");
        }
        return Sk.ffi.remapToPy(do_rects_intersect(self, argrect))
    });
    $loc.collidelist = new Sk.builtin.func(function (self, list) {
        if (Sk.abstr.typeName(list) !== "list") {
            throw new Sk.builtin.TypeError("Argument must be a sequence of rectstyle objects.");
        }
        var ret = -1;
        for (var i = 0; i < list.v.length; i++) {
            if (Sk.abstr.typeName(list.v[i]) !== "Rect") {
                throw new Sk.builtin.TypeError("Argument must be a sequence of rectstyle objects.");
            }
            if (do_rects_intersect(self, list.v[i])) {
                ret = i;
                break;
            }
        }
        return Sk.ffi.remapToPy(ret);
    });
    $loc.collidelistall = new Sk.builtin.func(function (self, list) {
        if (Sk.abstr.typeName(list) !== "list") {
            throw new Sk.builtin.TypeError("Argument must be a sequence of rectstyle objects.");
        }
        var ret = [];
        for (var i = 0; i < list.v.length; i++) {
            if (Sk.abstr.typeName(list.v[i]) !== "Rect") {
                throw new Sk.builtin.TypeError("Argument must be a sequence of rectstyle objects.");
            }
            if (do_rects_intersect(self, list.v[i])) {
                ret.push(i);
            }
        }
        return Sk.ffi.remapToPy(ret);
    });
};
