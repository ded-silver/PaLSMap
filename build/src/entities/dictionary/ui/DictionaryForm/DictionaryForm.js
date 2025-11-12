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
import { Button, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styles from './DictionaryForm.module.css';
export var DictionaryForm = function (_a) {
    var initialData = _a.initialData, onSubmit = _a.onSubmit, onCancel = _a.onCancel, isLoading = _a.isLoading;
    var t = useTranslation(['common', 'dictionary']).t;
    var _b = useForm({
        defaultValues: {
            short: (initialData === null || initialData === void 0 ? void 0 : initialData.short) || '',
            full: (initialData === null || initialData === void 0 ? void 0 : initialData.full) || ''
        },
        mode: 'onChange'
    }), control = _b.control, handleSubmit = _b.handleSubmit, errors = _b.formState.errors;
    var handleFormSubmit = function (data) {
        onSubmit(data);
    };
    return (_jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: styles.form, children: [_jsx(Controller, { name: 'short', control: control, rules: {
                    required: t('validation.shortRequired', { ns: 'dictionary' }),
                    minLength: {
                        value: 1,
                        message: t('validation.shortMinLength', { ns: 'dictionary' })
                    }
                }, render: function (_a) {
                    var _b;
                    var field = _a.field;
                    return (_jsx(TextField, __assign({}, field, { label: t('fields.short', { ns: 'dictionary' }), variant: 'outlined', fullWidth: true, error: !!errors.short, helperText: (_b = errors.short) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading, margin: 'normal' })));
                } }), _jsx(Controller, { name: 'full', control: control, rules: {
                    required: t('validation.fullRequired', { ns: 'dictionary' }),
                    minLength: {
                        value: 1,
                        message: t('validation.fullMinLength', { ns: 'dictionary' })
                    }
                }, render: function (_a) {
                    var _b;
                    var field = _a.field;
                    return (_jsx(TextField, __assign({}, field, { label: t('fields.full', { ns: 'dictionary' }), variant: 'outlined', fullWidth: true, error: !!errors.full, helperText: (_b = errors.full) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading, margin: 'normal', multiline: true, rows: 3 })));
                } }), _jsxs("div", { className: styles.actions, children: [_jsx(Button, { type: 'button', variant: 'outlined', onClick: onCancel, disabled: isLoading, children: t('buttons.cancel', { ns: 'common' }) }), _jsx(Button, { type: 'submit', variant: 'contained', disabled: isLoading, color: 'primary', children: isLoading
                            ? t('messages.saving', { ns: 'common' })
                            : t('buttons.save', { ns: 'common' }) })] })] }));
};
