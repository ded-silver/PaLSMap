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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { NodeService } from '../../model/api';
import styles from './SkeletonNode.module.css';
import { DialogData } from '@/entities/node-data';
import { NodeDataService } from '@/entities/node-data';
import { useDebouncedCallback } from '@/shared/hooks';
export var SkeletonNode = function (_a) {
    var id = _a.id, width = _a.width, height = _a.height, variant = _a.variant, name = _a.name, parentId = _a.parentId, isName = _a.isName, isData = _a.isData;
    var t = useTranslation(['common', 'nodes']).t;
    var getNode = useReactFlow().getNode;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useState(name !== null && name !== void 0 ? name : ''), nodeName = _c[0], setNodeName = _c[1];
    var node = getNode(id);
    var queryClient = useQueryClient();
    var isAdmin = localStorage.getItem('isAdmin');
    var _d = useState(false), confirmOpen = _d[0], setConfirmOpen = _d[1];
    var deleteNode = useMutation({
        mutationKey: ['deleteNode'],
        mutationFn: function (nodeId) { return NodeService.delete(nodeId); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['childNodes'] });
        },
        onError: function (error) {
            toast.error(t('messages.deleteError', { ns: 'nodes' }));
        }
    }).mutate;
    var handleDelete = function (e) {
        e.stopPropagation();
        deleteNode(id);
    };
    var updateCurrentNode = useMutation({
        mutationKey: ['updateCurrentNode'],
        mutationFn: function (data) {
            return NodeService.update(data.id, __assign(__assign({}, data), { data: __assign(__assign({}, data.data), { label: nodeName }), parentId: parentId }));
        },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['childNodes'] });
        },
        onError: function (error) {
            toast.error(t('messages.updateDataError', { ns: 'nodes' }));
        }
    }).mutate;
    var handleChangeNodeName = useDebouncedCallback(function (text) {
        if (node === null || node === void 0 ? void 0 : node.position) {
            updateCurrentNode(__assign(__assign({}, node), { id: id, type: variant, position: node === null || node === void 0 ? void 0 : node.position, measured: node.measured, data: node.data }));
        }
    }, 500);
    var handleClickOpen = function () {
        setOpen(true);
    };
    var invalidateParentData = useMutation({
        mutationKey: ['invalidateParentData'],
        mutationFn: function (parentId) { return NodeDataService.getNodeData(parentId); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['currentNodeData'] });
        },
        onError: function (error) {
            toast.error(t('messages.deleteError', { ns: 'nodes' }));
        }
    }).mutate;
    var handleClose = function () {
        if (parentId) {
            invalidateParentData(parentId);
        }
        setOpen(false);
    };
    var handleChangeNodeSize = useDebouncedCallback(function (event, params) {
        var width = params.width, height = params.height;
        if (node === null || node === void 0 ? void 0 : node.position) {
            updateCurrentNode(__assign(__assign({}, node), { id: id, type: variant, position: node === null || node === void 0 ? void 0 : node.position, measured: {
                    width: width,
                    height: height
                }, data: node.data }));
        }
    }, 500);
    return (_jsxs(_Fragment, { children: [isName ? (_jsx("input", { className: 'node-name', value: nodeName, placeholder: t('placeholders.name', { ns: 'nodes' }), readOnly: isAdmin !== 'true', onClick: function (e) { return e.stopPropagation(); }, onChange: function (e) {
                    if (isAdmin === 'true') {
                        setNodeName(e.target.value);
                        handleChangeNodeName();
                    }
                } })) : null, _jsx("div", { className: clsx(styles.node, styles[variant]), onClick: handleClickOpen, children: isAdmin === 'true' ? (_jsx(IconButton, { onClick: function (e) {
                        e.stopPropagation();
                        setConfirmOpen(true);
                    }, children: _jsx(DeleteOutlineIcon, { fontSize: 'small' }) })) : null }), isAdmin === 'true' && width && height ? (_jsx(NodeResizer, { minWidth: width, minHeight: height, maxHeight: 12200, maxWidth: 12200, onResize: function (event, params) { return handleChangeNodeSize(event, params); } })) : null, open && isData ? (_jsx(DialogData, { open: open, handleClose: handleClose, dialogName: name !== null && name !== void 0 ? name : t('labels.nameNotSet', { ns: 'nodes' }), id: id })) : null, _jsxs(Dialog, { open: confirmOpen, onClose: function () { return setConfirmOpen(false); }, children: [_jsx(DialogTitle, { children: t('dialogs.deleteTitle', { ns: 'nodes' }) }), _jsx(DialogContent, { children: _jsxs(DialogContentText, { children: [t('dialogs.deleteConfirm', { ns: 'nodes' }), ' ', _jsx("b", { children: name !== null && name !== void 0 ? name : t('labels.withoutName', { ns: 'nodes' }) }), "?"] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: function () { return setConfirmOpen(false); }, variant: 'contained', children: t('buttons.cancel', { ns: 'common' }) }), _jsx(Button, { onClick: function (e) {
                                    handleDelete(e);
                                    setConfirmOpen(false);
                                }, color: 'error', variant: 'contained', children: t('buttons.delete', { ns: 'common' }) })] })] })] }));
};
