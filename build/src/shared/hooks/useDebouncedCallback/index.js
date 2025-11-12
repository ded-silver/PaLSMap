/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-types */
import { useCallback, useEffect, useMemo, useRef } from 'react';
export var debounce = function (f, ms) {
    var timeout = null;
    var clear = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    var call = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clear();
        timeout = setTimeout(function () {
            f.apply(void 0, args);
        }, ms);
    };
    call.clear = clear;
    return call;
};
var useRefCallback = function (f) {
    var cb = useRef(f);
    useEffect(function () {
        cb.current = f;
    });
    return useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return cb.current.apply(cb, args);
    }, [cb]);
};
export var useDebouncedCallback = function (f, ms) {
    var cb = useRefCallback(f);
    return useMemo(function () { return debounce(cb, ms); }, [cb, ms]);
};
