var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import './SearchBar.scss';
export var SearchBar = function (_a) {
    var props = __rest(_a, []);
    var _b = useState(false), expanded = _b[0], setExpanded = _b[1];
    var inputRef = useRef(null);
    var containerRef = useRef(null);
    var handleExpand = function () {
        setExpanded(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    var handleBlur = function () {
        if (inputRef.current &&
            inputRef.current.value.trim() === '' &&
            expanded === true) {
            setExpanded(false);
        }
    };
    return (_jsxs("div", { ref: containerRef, className: "search-bar ".concat(expanded ? 'expanded' : ''), children: [_jsx("input", __assign({}, props, { className: 'search-input', ref: inputRef, type: 'text', 
                // placeholder='Поиск уставок...'
                onBlur: handleBlur })), _jsx("button", { className: 'search-btn', type: 'button', onClick: expanded ? function () { return setExpanded(false); } : handleExpand, children: _jsxs("svg", { width: '20px', height: '20px', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', children: [_jsx("g", { id: 'SVGRepo_bgCarrier', strokeWidth: '0' }), _jsx("g", { id: 'SVGRepo_tracerCarrier', strokeLinecap: 'round', strokeLinejoin: 'round' }), _jsx("g", { id: 'SVGRepo_iconCarrier', children: _jsx("path", { d: 'M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z', stroke: '#343743', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }) })] }) })] }));
};
