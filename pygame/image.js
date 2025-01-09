var $builtinmodule = function (name) {
    mod = {};

    const DEFAULT_PROXY_FUNCTION = (proxyValue) => function (str) {
        url = document.createElement("a");
        url.href = str;
        if (window.location.host !== url.host) {
            return proxyValue + "/" + str;
        }
        return str;
    }

    if (Sk.cachedEmoji === undefined) {
        Sk.cachedEmoji = {};
    }

    mod.load = new Sk.builtin.func(function (filename) {
        const fileobj = Sk.ffi.remapToJs(filename);
        console.log(fileobj);
        let svgMode = false;
        if (!Sk.builtin.checkString(filename)) {
            // Better hope it's an SVG dictionary!
            svgMode = true;
        }

        let proxy;
        if (svgMode && typeof (Sk.emojiProxy) === "function") {
            proxy = Sk.emojiProxy;
        } else if (svgMode && Sk.emojiProxy) {
            proxy = DEFAULT_PROXY_FUNCTION(Sk.emojiProxy);
        } else if (typeof (Sk.imageProxy) === "function") {
            proxy = Sk.imageProxy;
        } else {
            proxy = DEFAULT_PROXY_FUNCTION(Sk.imageProxy);
        }

        let w, h, r, newW, newH, t;
        if (svgMode) {
            w = Math.ceil(fileobj['width'] * fileobj['scale_x']);
            h = Math.ceil(fileobj['height'] * fileobj['scale_y']);
            r = -fileobj['angle'] * Math.PI / 180;
            newW = Math.ceil(w * Math.abs(Math.cos(r)) + h * Math.abs(Math.sin(r)));
            newH = Math.ceil(w * Math.abs(Math.sin(r)) + h * Math.abs(Math.cos(r)));
            t = new Sk.builtin.tuple([new Sk.builtin.int_(w), new Sk.builtin.int_(h)]);
        }

        const fullPath = proxy(svgMode ? fileobj['code'] : fileobj);
        console.log("FullPath", fullPath, Sk.cachedEmoji);
        if (svgMode && fullPath in Sk.cachedEmoji) {
            var img = Sk.cachedEmoji[fullPath];
            img.setAttribute('width', w);
            img.setAttribute('height', h);
            console.log("Now drawing it at", w, h);
            var s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
            var ctx = s.offscreen_canvas.getContext("2d");
            //const old = Sk.cachedEmoji[fullPath].offscreen_canvas;
            // Sk.cachedEmoji[fullPath] = Sk.misceval.callsim(PygameLib.SurfaceType, t);
            // Sk.cachedEmoji[fullPath].offscreen_canvas.getContext("2d").drawImage(img, 0, 0);
            ctx.drawImage(img, 0, 0);
            /*ctx.beginPath();
            ctx.rect(0, 0, 49, 49);
            const g = Math.round(Math.random()*255);
            const b = Math.round(Math.random()*255);
            ctx.fillStyle = `rgba(255, ${g}, ${b})`;
            ctx.fill();*/
            return s;
        }
        /*return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
            var t = new Sk.builtin.tuple([new Sk.builtin.int_(50), new Sk.builtin.int_(50)]);
            var s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
            var ctx = s.offscreen_canvas.getContext("2d");
            ctx.beginPath();
            ctx.rect(0, 0, 49, 49);
            const g = Math.round(Math.random()*255);
            const b = Math.round(Math.random()*255);
            ctx.fillStyle = `rgba(255, ${g}, ${b})`;
            ctx.fill();
            console.log("LOCKON HERE");
            resolve(s);
            return Sk.builtin.none.none$;
        }));*/
        return new Sk.misceval.promiseToSuspension(new Promise(function (resolve) {
            var img = new Image();
            img.crossOrigin = "anonymous";
            img.src = fullPath;
            img.onload = function () {
                if (svgMode) {
                    console.log(img, img.src, fileobj['width'], fileobj['height'], newW, newH);
                    //img.style.transform = `scale(${fileobj['flip_x']}${fileobj['scale_x']}, ${fileobj['flip_y']}${fileobj['scale_y']})`;
                    img.setAttribute('width', w);
                    img.setAttribute('height', h);
                    //console.log(fileobj, img);
                    var s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
                    var ctx = s.offscreen_canvas.getContext("2d");
                    Sk.cachedEmoji[fullPath] = img;
                    /*ctx.save();
                    ctx.translate(newW / 2, newH / 2);
                    ctx.rotate(r);
                    ctx.translate(-w / 2, -h / 2);*/
                    ctx.drawImage(img, 0, 0);
                    resolve(s);
                    //ctx.restore();
                } else {
                    const t = new Sk.builtin.tuple([img.width, img.height]);
                    const s = Sk.misceval.callsim(PygameLib.SurfaceType, t);
                    const ctx = s.offscreen_canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    resolve(s);
                }
            };
            img.onerror = function () {
                throw new Sk.builtin.RuntimeError("Image does not exist.");
            }
        }));
    });
    mod.get_extended = new Sk.builtin.func(function () {
        return Sk.ffi.remapToPy(false);
    });
    mod.save = new Sk.builtin.func(function (surf, filename) {
        var fname = 'surface';
        if (filename !== undefined) {
            fname = Sk.ffi.remapToJs(filename);
        }
        // https://stackoverflow.com/a/34707543
        saveAsPNG(surf.offscreen_canvas, fname);

        function saveAsPNG(image, filename) { // No IE <11 support. Chrome URL bug for large images may crash
            var anchorElement, event, blob;

            function image2Canvas(image) {  // converts an image to canvas
                function createCanvas(width, height) {  // creates a canvas of width height
                    var can = document.createElement("canvas");
                    can.width = width;
                    can.height = height;
                    return can;
                };
                var newImage = canvas(img.width, img.height); // create new image
                newImage.ctx = newImage.getContext("2d");  // get image context
                newImage.ctx.drawImage(image, 0, 0); // draw the image onto the canvas
                return newImage;  // return the new image
            }

            if (image.toDataURL === undefined) {    // does the image have the toDataURL function
                image = image2Canvas(image);  // No then convert to canvas
            }
            // if msToBlob and msSaveBlob then use them to save. IE >= 10
            // As suggested by Kaiido
            if (image.msToBlob !== undefined && navigator.msSaveBlob !== undefined) {
                blob = image.msToBlob();
                navigator.msSaveBlob(blob, filename + ".png");
                return;
            }
            anchorElement = document.createElement('a');  // Create a download link
            anchorElement.href = image.toDataURL();   // attach the image data URL
            // check for download attribute
            if (anchorElement.download !== undefined) {
                anchorElement.download = filename + ".png";  // set the download filename
                if (typeof MouseEvent === "function") {   // does the browser support the object MouseEvent
                    event = new MouseEvent(   // yes create a new mouse click event
                        "click", {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            ctrlKey: false,
                            altKey: false,
                            shiftKey: false,
                            metaKey: false,
                            button: 0,
                            buttons: 1,
                        }
                    );
                    anchorElement.dispatchEvent(event); // simulate a click on the download link.
                } else if (anchorElement.fireEvent) {    // if no MouseEvent object try fireEvent
                    anchorElement.fireEvent("onclick");
                }
            }
        }
    });
    return mod;
};
