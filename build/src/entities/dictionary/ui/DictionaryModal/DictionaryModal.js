import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DictionaryForm } from '../DictionaryForm';
export var DictionaryModal = function (_a) {
    var isOpen = _a.isOpen, mode = _a.mode, item = _a.item, onClose = _a.onClose, onSubmit = _a.onSubmit, isLoading = _a.isLoading;
    var t = useTranslation('dictionary').t;
    var handleSubmit = function (data) {
        onSubmit(data);
    };
    var handleCancel = function () {
        onClose();
    };
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, maxWidth: 'md', fullWidth: true, PaperProps: {
            sx: {
                borderRadius: '12px'
            }
        }, children: [_jsxs(DialogTitle, { sx: {
                    backgroundColor: '#0073e6',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px'
                }, children: [_jsx(Typography, { sx: { fontSize: '1.5rem', fontWeight: 600 }, children: mode === 'create' ? t('buttons.add') : t('buttons.edit') }), _jsx(IconButton, { "aria-label": 'close', onClick: onClose, sx: {
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }, children: _jsx(CloseIcon, {}) })] }), _jsx(DialogContent, { sx: { padding: '24px' }, children: _jsx(DictionaryForm, { initialData: item, onSubmit: handleSubmit, onCancel: handleCancel, isLoading: isLoading }, (item === null || item === void 0 ? void 0 : item.id) || 'create') })] }));
};
