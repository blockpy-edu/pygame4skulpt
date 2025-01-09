function skulptGetIndex(obj, index) {
    return Sk.ffi.remapToJs(Sk.abstr.objectGetItem(obj, new Sk.builtin.int_(index)));
}

var $builtinmodule = function (name) {
    mod = {};
    mod.rect = new Sk.builtin.func(draw_rect);
    mod.polygon = new Sk.builtin.func(draw_polygon);
    mod.circle = new Sk.builtin.func(draw_circle);
    mod.ellipse = new Sk.builtin.func(draw_ellipse);
    mod.arc = new Sk.builtin.func(draw_arc);
    mod.line = new Sk.builtin.func(draw_line);
    mod.lines = new Sk.builtin.func(draw_lines);
    mod.aaline = new Sk.builtin.func(draw_aaline);
    mod.aalines = new Sk.builtin.func(draw_aalines);
    return mod;
};

//returns Rect object used as bounding box for drawing functions
var bbox = function (min_h, max_h, min_w, max_w) {
    var width = max_w - min_w;
    var height = max_h - min_h;
    var top = min_h;
    var left = min_w;
    t = new Sk.builtin.tuple([left, top]);
    return PygameLib.make_rect(left, top, width, height);
};

function rgbaColorFromPygame(color_js) {
    return 'rgba(' + color_js[0] + ', ' + color_js[1] + ', ' + color_js[2] + ', ' + color_js[3] + ')';
}

//pygame.draw.rect()
//rect(Surface, color, Rect, width=0) -> Rect
var draw_rect = function (surface, color, rect, width = 0) {
    var ctx = surface.context2d;
    var color_js = PygameLib.extract_color(color);
    var width_js = Sk.ffi.remapToJs(width);

    var left = skulptGetIndex(rect, 0);
    var top = skulptGetIndex(rect, 1);
    var w = skulptGetIndex(rect, 2);
    var h = skulptGetIndex(rect, 3);

    if (width_js) {
        ctx.lineWidth = width_js;
        ctx.strokeStyle = rgbaColorFromPygame(color_js);
        ctx.strokeRect(left, top, w, h);
    } else {
        ctx.fillStyle = rgbaColorFromPygame(color_js);
        ctx.fillRect(left, top, w, h);
    }

    return PygameLib.make_rect(left, top, w, h);
};

//pygame.draw.polygon()
//polygon(Surface, color, pointlist, width=0) -> Rect
var draw_polygon = function (surface, color, pointlist, width = 0) {
    return draw_lines(surface, color, true, pointlist, width);
};

//pygame.draw.circle()
//circle(Surface, color, pos, radius, width=0) -> Rect
var draw_circle = function (surface, color, pos, radius, width = 0) {
    var ctx = surface.context2d;
    var width_js = Sk.ffi.remapToJs(width);
    let x = skulptGetIndex(pos, 0);
    let y = skulptGetIndex(pos, 1);
    var rad = Sk.ffi.remapToJs(radius);
    var color_js = PygameLib.extract_color(color);
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    if (width_js) {
        ctx.lineWidth = width_js;
        ctx.strokeStyle = rgbaColorFromPygame(color_js);
        ctx.stroke();
    } else {
        ctx.fillStyle = rgbaColorFromPygame(color_js);
        ctx.fill();
    }

    return bbox(x - rad, y + rad, x - rad, y + rad);
};

//pygame.draw.arc()
//arc(Surface, color, Rect, start_angle, stop_angle, width=1) -> Rect
var draw_arc = function (surface, color, rect, start_angle, stop_angle, width = 0) {
    return draw_oval(surface, color, rect, start_angle, stop_angle, width, false);
};

//pygame.draw.arg()
//ellipse(Surface, color, Rect, width=0) -> Rect
var draw_ellipse = function (surface, color, rect, width = 0) {
    return draw_oval(surface, color, rect, 0, 2 * Math.PI, width, true);
};

//help function
var draw_oval = function (surface, color, rect, start_angle, stop_angle, width, ellipse = false) {
    var ctx = surface.context2d;
    var width_js = Sk.ffi.remapToJs(width);
    var color_js = PygameLib.extract_color(color);

    var left = skulptGetIndex(rect, 0);
    var top = skulptGetIndex(rect, 1);
    var w = skulptGetIndex(rect, 2);
    var h = skulptGetIndex(rect, 3);

    var angles = [0, 0];
    angles[0] = Sk.ffi.remapToJs(start_angle);
    angles[1] = Sk.ffi.remapToJs(stop_angle);
    var centerX = left + w / 2;
    var centerY = top + h / 2;

    ctx.beginPath();

    ctx.ellipse(centerX, centerY, w / 2, h / 2, 0, -angles[0], -angles[1], true);

    if (width_js) {
        ctx.lineWidth = width_js;
        ctx.strokeStyle = rgbaColorFromPygame(color_js);
        ctx.stroke();
    } else if (ellipse) {
        ctx.fillStyle = rgbaColorFromPygame(color_js);
        ctx.fill();
    }

    return PygameLib.make_rect(left, top, w, h);
};

//pygame.draw.line()
//line(Surface, color, start_pos, end_pos, width=1) -> Rect
var draw_line = function (surface, color, start_pos, end_pos, width = 1) {
    const width_js = Sk.ffi.remapToJs(width);
    const ax = skulptGetIndex(start_pos, 0);
    const ay = skulptGetIndex(start_pos, 1);
    const bx = skulptGetIndex(end_pos, 0);
    const by = skulptGetIndex(end_pos, 1);
    let points;
    if (Math.abs(ax - bx) <= Math.abs(ay - by)) {
        points = new Sk.builtin.list([new Sk.builtin.tuple([ax - width_js / 2, ay]),
                                      new Sk.builtin.tuple([ax + width_js / 2, ay]),
                                      new Sk.builtin.tuple([bx + width_js / 2, by]),
                                      new Sk.builtin.tuple([bx - width_js / 2, by])]);
    }
    else {
        points = new Sk.builtin.list([new Sk.builtin.tuple([ax, ay - width_js / 2]),
                                      new Sk.builtin.tuple([ax, ay + width_js / 2]),
                                      new Sk.builtin.tuple([bx, by + width_js / 2]),
                                      new Sk.builtin.tuple([bx, by - width_js / 2])]);
    }
    draw_polygon(surface, color, points);
    const left = Math.min(ax, bx);
    const right = Math.max(ax, bx);
    const top = Math.min(ay, by);
    const bot = Math.max(ay, by);
    return bbox(top, bot, left, right);
};

//pygame.draw.lines()
//lines(Surface, color, closed, pointlist, width=1) -> Rect
var draw_lines = function (surface, color, closed, pointlist, width = 1) {
    var width_js = Sk.ffi.remapToJs(width);
    var closed_js = Sk.ffi.remapToJs(closed);
    var color_js = PygameLib.extract_color(color);
    var ctx = surface.context2d;

    const iter = Sk.abstr.iter(pointlist);
    const first = Sk.abstr.iternext(iter, false);

    let min_w, min_h, max_h, max_w;
    const extend = (x, y) => {
        min_w = Math.min(min_w, x);
        max_w = Math.max(max_w, x);
        min_h = Math.min(min_h, y);
        max_h = Math.max(max_h, y);
    }
    const initializeSize = (x, y) => {
        min_w = x;
        max_w = x;
        min_h = y;
        max_h = y;
    }
    if (!width_js) {
        ctx.beginPath();
        ctx.lineWidth = width_js;
        initializeSize(skulptGetIndex(first, 0), skulptGetIndex(first, 1));
        ctx.moveTo(min_w, min_h);

        Sk.misceval.iterFor(iter, function (point) {
            const x = skulptGetIndex(point, 0);
            const y = skulptGetIndex(point, 1);
            ctx.lineTo(x, y);
            extend(x, y);
        });

        if (closed_js) {
            ctx.closePath();
        }
        console.log("W", width_js);
    } else {
        let cx =skulptGetIndex(first, 0);
        let cy =skulptGetIndex(first, 1);
        initializeSize(cx, cy);
        Sk.misceval.iterFor(iter, function (point) {
            const nx = skulptGetIndex(point, 0);
            const ny = skulptGetIndex(point, 1);
            draw_line(surface, color, new Sk.builtin.tuple([cx, cy]), new Sk.builtin.tuple([nx, ny]), width);
            extend(nx, ny);
            cx = nx;
            cy = ny;
        });
        console.log("L", width_js, min_h, max_h, min_w, max_w);
        return bbox(min_h, max_h, min_w, max_w);
    }

    if (width_js) {
        ctx.strokeStyle = rgbaColorFromPygame(color_js);
        ctx.stroke();
    } else {
        ctx.fillStyle = rgbaColorFromPygame(color_js);
        ctx.fill();
    }
    console.log("A", width_js, min_h, max_h, min_w, max_w);
    return bbox(min_h, max_h, min_w, max_w);
};

//pygame.draw.aaline()
//aaline(Surface, color, startpos, endpos, blend=1) -> Rect
var draw_aaline = function (surface, color, startpos, endpos, blend = 1) {
    return draw_line(surface, color, startpos, endpos);
};

//pygame.draw.aalines()
//aalines(Surface, color, closed, pointlist, blend=1) -> Rect
var draw_aalines = function (surface, color, closed, pointlist, blend = 1) {
    return draw_lines(surface, color, closed, pointlist);
};
