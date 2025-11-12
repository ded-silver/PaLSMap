import { jsx as _jsx } from "react/jsx-runtime";
import '../App.css';
import { QueryProvider } from './providers';
import { Router } from './router';
export var App = function () {
    return (_jsx(QueryProvider, { children: _jsx(Router, {}) }));
};
