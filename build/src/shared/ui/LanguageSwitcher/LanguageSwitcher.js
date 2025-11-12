import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MenuItem, Select } from '@mui/material';
import { useLanguage } from '../../hooks/useLanguage';
import styles from './LanguageSwitcher.module.css';
export var LanguageSwitcher = function () {
    var _a = useLanguage(), currentLanguage = _a.currentLanguage, changeLanguage = _a.changeLanguage;
    var handleChange = function (event) {
        changeLanguage(event.target.value);
    };
    return (_jsxs(Select, { value: currentLanguage, onChange: handleChange, size: 'small', className: styles.select, sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '& .MuiSelect-select': {
                padding: '4px 32px 4px 8px',
                fontSize: '0.875rem',
                color: 'white'
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.4)'
            },
            '& .MuiSvgIcon-root': {
                color: 'white'
            }
        }, children: [_jsx(MenuItem, { value: 'ru', children: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }), _jsx(MenuItem, { value: 'en', children: "English" })] }));
};
