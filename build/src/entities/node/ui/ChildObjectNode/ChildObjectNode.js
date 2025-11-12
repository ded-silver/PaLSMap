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
import { IconButton } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from './ChildObjectNode.module.css';
import { NodeService } from '@/entities/node';
import { DialogData, NodeDataService } from '@/entities/node-data';
import { useDebouncedCallback } from '@/shared/hooks';
export var ChildObjectNode = function (_a) {
    var data = _a.data, id = _a.id, parentId = _a.parentId;
    var t = useTranslation(['common', 'nodes']).t;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var getNode = useReactFlow().getNode;
    var queryClient = useQueryClient();
    var _c = useState(data.label), nodeName = _c[0], setNodeName = _c[1];
    var node = getNode(id);
    var isAdmin = localStorage.getItem('isAdmin');
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
    var handleDelete = function () {
        deleteNode(id);
    };
    var handleChangeNodeName = useDebouncedCallback(function (text) {
        if (node === null || node === void 0 ? void 0 : node.position) {
            updateCurrentNode(__assign(__assign({}, node), { id: id, type: 'ChildObject', position: node === null || node === void 0 ? void 0 : node.position, data: data }));
        }
    }, 500);
    return (_jsxs("div", { className: styles['nodeName'], style: { position: 'relative' }, children: [_jsx("input", { value: nodeName, placeholder: t('placeholders.name', { ns: 'nodes' }), readOnly: isAdmin !== 'true', onChange: function (e) {
                    if (isAdmin === 'true') {
                        setNodeName(e.target.value);
                        handleChangeNodeName();
                    }
                }, style: {
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'inherit',
                    textAlign: 'center',
                    fontSize: '22px',
                    pointerEvents: 'auto',
                    zIndex: '1003'
                } }), _jsx("div", { className: styles['deleteButtonWrapper'], onClick: function (e) { return e.stopPropagation(); }, children: isAdmin === 'true' ? (_jsx(IconButton, { onClick: handleDelete, children: _jsx(DeleteOutlineIcon, { fontSize: 'small' }) })) : null }), _jsx("div", { className: styles['container'], onClick: handleClickOpen, children: _jsx("div", { className: styles['cube'] }) }), open ? (_jsx(DialogData, { open: open, handleClose: handleClose, id: id, dialogName: data.label })) : null] }));
};
