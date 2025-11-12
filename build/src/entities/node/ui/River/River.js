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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { NodeService } from '../../model/api';
import styles from './River.module.css';
import { useDebouncedCallback } from '@/shared/hooks';
export var River = function (_a) {
    var data = _a.data, id = _a.id;
    var t = useTranslation(['common', 'nodes']).t;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var getNode = useReactFlow().getNode;
    var _c = useState(data.label), nodeName = _c[0], setNodeName = _c[1];
    var queryClient = useQueryClient();
    var node = getNode(id);
    var isAdmin = localStorage.getItem('isAdmin');
    var _d = useState(false), confirmOpen = _d[0], setConfirmOpen = _d[1];
    var handleClickOpen = function () {
        setOpen(true);
    };
    var handleClose = function () {
        queryClient.invalidateQueries({ queryKey: ['currentNodeData'] });
        setOpen(false);
    };
    var deleteNode = useMutation({
        mutationKey: ['deleteNode'],
        mutationFn: function (nodeId) { return NodeService.delete(nodeId); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['nodes'] });
        },
        onError: function (error) {
            toast.error(t('messages.deleteError', { ns: 'nodes' }));
        }
    }).mutate;
    var updateCurrentNode = useMutation({
        mutationKey: ['updateCurrentNode'],
        mutationFn: function (data) {
            return NodeService.update(data.id, __assign(__assign({}, data), { data: __assign(__assign({}, data.data), { label: nodeName }) }));
        },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['nodes'] });
        },
        onError: function (error) {
            toast.error(t('messages.updateDataError', { ns: 'nodes' }));
        }
    }).mutate;
    var handleDelete = function () {
        deleteNode(id);
    };
    var handleChangeNodeName = useDebouncedCallback(function () {
        if (node === null || node === void 0 ? void 0 : node.position) {
            updateCurrentNode(__assign(__assign({}, node), { id: id, type: 'River', position: node === null || node === void 0 ? void 0 : node.position, data: data }));
        }
    }, 500);
    return (_jsxs("div", { className: styles['nodeName'], children: [_jsx("input", { value: nodeName, placeholder: t('placeholders.riverName', { ns: 'nodes' }), readOnly: isAdmin !== 'true', onChange: function (e) {
                    if (isAdmin === 'true') {
                        setNodeName(e.target.value);
                        handleChangeNodeName();
                    }
                }, style: {
                    backgroundColor: 'transparent',
                    top: 'calc(10% - 25px)',
                    border: 'none',
                    outline: 'none',
                    color: 'inherit',
                    textAlign: 'center',
                    transform: 'rotate(60deg)',
                    transformOrigin: 'center',
                    fontSize: '30px'
                } }), _jsx("div", { className: styles['deleteButtonWrapper'], onClick: function (e) { return e.stopPropagation(); }, children: isAdmin === 'true' ? (_jsx(IconButton, { onClick: function () {
                        setConfirmOpen(true);
                    }, children: _jsx(DeleteOutlineIcon, { fontSize: 'small' }) })) : null }), _jsx("div", { onClick: handleClickOpen, style: { transform: 'rotate(60deg)', cursor: 'pointer' }, children: _jsx("svg", { width: '650', height: '50', viewBox: '0 0 650 50', xmlns: 'http://www.w3.org/2000/svg', style: { display: 'block' }, children: _jsx("path", { d: 'M0,25 \r\n         C40,5 80,45 120,25 \r\n         C160,5 200,45 240,25 \r\n         C280,5 320,45 360,25 \r\n         C400,5 440,45 480,25 \r\n         C520,5 560,45 600,25 \r\n         C620,15 640,35 650,25', fill: 'none', stroke: 'rgba(14, 165, 233, 0.7)', strokeWidth: '8', strokeLinecap: 'round' }) }) }), _jsxs(Dialog, { open: confirmOpen, onClose: function () { return setConfirmOpen(false); }, children: [_jsx(DialogTitle, { children: t('dialogs.deleteTitle', { ns: 'nodes' }) }), _jsx(DialogContent, { children: _jsxs(DialogContentText, { children: [t('dialogs.deleteConfirm', { ns: 'nodes' }), ' ', _jsx("b", { children: nodeName || t('labels.withoutName', { ns: 'nodes' }) }), "?"] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: function () { return setConfirmOpen(false); }, variant: 'contained', children: t('buttons.cancel', { ns: 'common' }) }), _jsx(Button, { onClick: function () {
                                    handleDelete();
                                    setConfirmOpen(false);
                                }, color: 'error', variant: 'contained', children: t('buttons.delete', { ns: 'common' }) })] })] })] }));
};
