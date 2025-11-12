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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';
import { authService } from '@/entities/user';
export function Auth() {
    var t = useTranslation(['common', 'auth']).t;
    var _a = useState('login'), tab = _a[0], setTab = _a[1];
    var _b = useForm({
        mode: 'onChange'
    }), register = _b.register, handleSubmit = _b.handleSubmit, reset = _b.reset;
    var navigate = useNavigate();
    var auth = useMutation({
        mutationKey: ['auth'],
        mutationFn: function (data) {
            return authService.main(tab === 'login' ? 'login' : 'register', data);
        },
        onSuccess: function (data) {
            localStorage.setItem('authToken', data.data.accessToken);
            toast.success(t('messages.success', { ns: 'auth' }));
            reset();
            navigate('/');
        },
        onError: function () {
            toast.error(tab === 'login'
                ? t('messages.loginError', { ns: 'auth' })
                : t('messages.registerError', { ns: 'auth' }));
        }
    }).mutate;
    var onSubmit = function (data) {
        auth(__assign(__assign({}, data), { isAdmin: false }));
    };
    return (_jsx("div", { className: styles.container, children: _jsxs("form", { className: styles.form, onSubmit: handleSubmit(onSubmit), children: [_jsxs(Tabs, { value: tab, onChange: function (_, value) { return setTab(value); }, variant: 'fullWidth', children: [_jsx(Tab, { value: 'login', label: t('tabs.login', { ns: 'auth' }) }), _jsx(Tab, { value: 'register', label: t('tabs.register', { ns: 'auth' }) })] }), _jsx(Typography, { variant: 'h5', align: 'center', children: tab === 'login'
                        ? t('tabs.login', { ns: 'auth' })
                        : t('tabs.register', { ns: 'auth' }) }), _jsx(TextField, __assign({ label: t('fields.email', { ns: 'auth' }), type: 'email' }, register('email', {
                    required: t('validation.emailRequired', { ns: 'auth' })
                }))), _jsx(TextField, __assign({ label: t('fields.password', { ns: 'auth' }), type: 'password' }, register('password', {
                    required: t('validation.passwordRequired', { ns: 'auth' })
                }))), tab === 'register' && (_jsx(TextField, __assign({ label: t('fields.name', { ns: 'auth' }), placeholder: t('fields.namePlaceholder', { ns: 'auth' }) }, register('name')))), _jsx(Button, { type: 'submit', variant: 'contained', children: tab === 'login'
                        ? t('buttons.login', { ns: 'auth' })
                        : t('buttons.register', { ns: 'auth' }) })] }) }));
}
