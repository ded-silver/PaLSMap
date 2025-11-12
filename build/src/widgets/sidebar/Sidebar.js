import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
export var Sidebar = function (_a) {
    var _b;
    var isOpen = _a.isOpen;
    var t = useTranslation('common').t;
    return (_jsx("div", { className: clsx(styles.sidebar, (_b = {}, _b[styles.open] = isOpen, _b)), children: _jsxs("ul", { className: styles.menu, children: [_jsx(NavLink, { to: '/', className: function (_a) {
                        var _b;
                        var isActive = _a.isActive;
                        return clsx(styles.link, (_b = {}, _b[styles.active] = isActive, _b));
                    }, children: _jsxs("li", { children: [_jsx(HomeIcon, { fontSize: 'small' }), _jsx("span", { children: t('sidebar.home') })] }) }), _jsx(NavLink, { to: '/dictionary', className: function (_a) {
                        var _b;
                        var isActive = _a.isActive;
                        return clsx(styles.link, (_b = {}, _b[styles.active] = isActive, _b));
                    }, children: _jsxs("li", { children: [_jsx(BookIcon, { fontSize: 'small' }), _jsx("span", { children: t('sidebar.dictionary') })] }) })] }) }));
};
