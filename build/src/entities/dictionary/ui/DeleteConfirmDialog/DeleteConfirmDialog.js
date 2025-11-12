import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './DeleteConfirmDialog.module.css';
export var DeleteConfirmDialog = function (_a) {
    var isOpen = _a.isOpen, item = _a.item, onClose = _a.onClose, onConfirm = _a.onConfirm, isLoading = _a.isLoading;
    var t = useTranslation(['common', 'dictionary']).t;
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, maxWidth: 'sm', fullWidth: true, PaperProps: {
            sx: {
                borderRadius: '12px'
            }
        }, children: [_jsx(DialogTitle, { children: _jsx(Typography, { sx: { fontSize: '1.25rem', fontWeight: 600 }, children: t('messages.deleteTitle', { ns: 'dictionary' }) }) }), _jsxs(DialogContent, { children: [_jsx(DialogContentText, { children: t('messages.deleteConfirm', { ns: 'dictionary' }) }), _jsxs("div", { className: styles.itemInfo, children: [_jsx(Typography, { variant: 'body2', sx: { fontWeight: 600, marginBottom: '8px' }, children: t('messages.abbreviation', { ns: 'dictionary' }) }), _jsx(Typography, { variant: 'body1', sx: { marginBottom: '16px' }, children: item.short }), _jsx(Typography, { variant: 'body2', sx: { fontWeight: 600, marginBottom: '8px' }, children: t('messages.fullName', { ns: 'dictionary' }) }), _jsx(Typography, { variant: 'body1', children: item.full })] })] }), _jsxs(DialogActions, { sx: { padding: '16px 24px' }, children: [_jsx(Button, { onClick: onClose, disabled: isLoading, variant: 'outlined', children: t('buttons.cancel', { ns: 'common' }) }), _jsx(Button, { onClick: onConfirm, disabled: isLoading, variant: 'contained', color: 'error', startIcon: isLoading ? _jsx(CircularProgress, { size: 16 }) : null, children: isLoading
                            ? t('messages.deleting', { ns: 'common' })
                            : t('buttons.delete', { ns: 'common' }) })] })] }));
};
