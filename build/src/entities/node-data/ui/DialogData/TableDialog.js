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
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { NodeDataService } from '@/entities/node-data';
var initialValues = {
    protectionName: '',
    excerpt: '',
    source: '',
    triggeringConditions: '',
    triggeringAlgorithm: ''
};
export default function TableDialog(_a) {
    var open = _a.open, handleClose = _a.handleClose, isDetails = _a.isDetails, row = _a.row, nodeId = _a.nodeId, items = _a.items;
    var tNodes = useTranslation('nodes').t;
    var tValidation = useTranslation('validation').t;
    var queryClient = useQueryClient();
    var createNodeData = useMutation({
        mutationKey: ['createNodeData'],
        mutationFn: function (data) { return NodeDataService.createNodeData(data); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['currentNodeData'] });
        },
        onError: function (error) {
            toast.error(tNodes('messages.addDataError'));
        }
    }).mutate;
    var updateNodeData = useMutation({
        mutationKey: ['updateNodeData'],
        mutationFn: function (data) { return NodeDataService.updateNodeData(data); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['currentNodeData'] });
        },
        onError: function (error) {
            toast.error(tNodes('messages.updateDataError'));
        }
    }).mutate;
    var _b = useForm({
        mode: 'onBlur',
        defaultValues: initialValues
    }), errors = _b.formState.errors, control = _b.control, reset = _b.reset, handleSubmit = _b.handleSubmit;
    var onSubmit = function (data) {
        if (!isDetails && !row) {
            createNodeData({
                id: nodeId,
                data: __assign(__assign({}, data), { order: items.length })
            });
        }
        else {
            updateNodeData(data);
        }
        reset(initialValues);
        handleClose();
    };
    useEffect(function () {
        if (isDetails && row) {
            reset(row);
        }
    }, [isDetails, reset, row]);
    return (_jsxs(Dialog, { open: open, children: [_jsx(DialogTitle, { children: _jsx(IconButton, { "aria-label": 'close', onClick: handleClose, sx: {
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }, children: _jsx(CloseIcon, {}) }) }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { control: control, name: 'protectionName', rules: {
                                    required: tValidation('protectionNameRequired')
                                }, render: function (_a) {
                                    var _b, _c;
                                    var field = _a.field;
                                    return (_jsx(TextField, { label: tNodes('fields.protectionName'), id: 'standard-multiline-static', fullWidth: true, multiline: true, onChange: field.onChange, inputRef: field.ref, value: field.value || '', error: !!((_b = errors.protectionName) === null || _b === void 0 ? void 0 : _b.message), helperText: (_c = errors.protectionName) === null || _c === void 0 ? void 0 : _c.message, sx: { mt: 2 } }));
                                } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { control: control, name: 'excerpt', rules: {
                                    required: tValidation('excerptRequired')
                                }, render: function (_a) {
                                    var _b, _c;
                                    var field = _a.field;
                                    return (_jsx(TextField, { label: tNodes('fields.excerpt'), fullWidth: true, multiline: true, onChange: field.onChange, inputRef: field.ref, value: field.value || '', error: !!((_b = errors.excerpt) === null || _b === void 0 ? void 0 : _b.message), helperText: (_c = errors.excerpt) === null || _c === void 0 ? void 0 : _c.message, sx: { mt: 2 } }));
                                } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { control: control, name: 'source', rules: {
                                    required: tValidation('sourceRequired')
                                }, render: function (_a) {
                                    var _b, _c;
                                    var field = _a.field;
                                    return (_jsx(TextField, { label: tNodes('fields.source'), fullWidth: true, multiline: true, onChange: field.onChange, inputRef: field.ref, value: field.value || '', error: !!((_b = errors.source) === null || _b === void 0 ? void 0 : _b.message), helperText: (_c = errors.source) === null || _c === void 0 ? void 0 : _c.message }));
                                } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { control: control, name: 'triggeringConditions', rules: {
                                    required: tValidation('triggeringConditionsRequired')
                                }, render: function (_a) {
                                    var _b, _c;
                                    var field = _a.field;
                                    return (_jsx(TextField, { label: tNodes('fields.triggeringConditions'), fullWidth: true, multiline: true, onChange: field.onChange, inputRef: field.ref, value: field.value || '', error: !!((_b = errors.triggeringConditions) === null || _b === void 0 ? void 0 : _b.message), helperText: (_c = errors.triggeringConditions) === null || _c === void 0 ? void 0 : _c.message }));
                                } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Controller, { control: control, name: 'triggeringAlgorithm', rules: {
                                    required: tValidation('triggeringAlgorithmRequired')
                                }, render: function (_a) {
                                    var _b, _c;
                                    var field = _a.field;
                                    return (_jsx(TextField, { id: 'standard-multiline-static', label: tNodes('fields.triggeringAlgorithm'), rows: 16, fullWidth: true, multiline: true, onChange: field.onChange, inputRef: field.ref, value: field.value || '', error: !!((_b = errors.triggeringAlgorithm) === null || _b === void 0 ? void 0 : _b.message), helperText: (_c = errors.triggeringAlgorithm) === null || _c === void 0 ? void 0 : _c.message, sx: { width: '552px' } }));
                                } }) })] }) }), _jsx(DialogActions, { children: _jsxs(Button, { variant: 'contained', onClick: handleSubmit(onSubmit), children: [_jsx(SaveIcon, {}), tNodes('actions.save')] }) })] }));
}
