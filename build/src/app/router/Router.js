import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from '@/components/layouts/Main/Main';
import { Auth } from '@/pages/auth';
import { DictionaryPage } from '@/pages/dictionary';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
export var Router = function () {
    var _a = useState(false), isSidebarOpen = _a[0], setSidebarOpen = _a[1];
    var toggleSidebar = function () {
        setSidebarOpen(!isSidebarOpen);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsxs("div", { className: 'app-layout', children: [_jsx(Header, { toggleSidebar: toggleSidebar }), _jsxs("div", { className: 'content-layout', children: [_jsx(Sidebar, { isOpen: isSidebarOpen }), _jsx("div", { style: { flexGrow: 1 }, children: _jsx(Main, { isSidebarOpen: isSidebarOpen }) })] })] }) }), _jsx(Route, { path: '/auth', element: _jsx(Auth, {}) }), _jsx(Route, { path: '/dictionary', element: _jsxs("div", { className: 'app-layout', children: [_jsx(Header, { toggleSidebar: toggleSidebar }), _jsxs("div", { className: 'content-layout', children: [_jsx(Sidebar, { isOpen: isSidebarOpen }), _jsx("div", { style: { flexGrow: 1 }, children: _jsx(DictionaryPage, {}) })] })] }) })] }), _jsx(ToastContainer, { "aria-label": 'asd' })] }));
};
