import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TableDialog from './TableDialog';
import { NodeDataService } from '@/entities/node-data';
import { useDialog } from '@/shared/hooks';
export var Cell = function (_a) {
    var row = _a.row, nodeId = _a.nodeId, items = _a.items;
    var tNodes = useTranslation('nodes').t;
    var tCommon = useTranslation('common').t;
    var queryClient = useQueryClient();
    var _b = useDialog(), isOpen = _b.isOpen, handleDialogOpen = _b.handleDialogOpen, handleDialogClose = _b.handleDialogClose;
    var isAdmin = localStorage.getItem('isAdmin');
    var _c = useState(false), confirmOpen = _c[0], setConfirmOpen = _c[1]; // новое состояние
    var deleteNodeData = useMutation({
        mutationKey: ['updateNodeData'],
        mutationFn: function (id) { return NodeDataService.deleteNodeData(id); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['currentNodeData'] });
            toast.success(tNodes('messages.deleteRowSuccess'));
        },
        onError: function () {
            toast.error(tNodes('messages.deleteRowError'));
        }
    }).mutate;
    var handleDeleteConfirmed = function () {
        deleteNodeData(row.id);
        setConfirmOpen(false);
    };
    return (_jsx(_Fragment, { children: isAdmin === 'true' && (_jsxs(Box, { width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', children: [_jsx(Tooltip, { title: tNodes('actions.edit'), children: _jsx(IconButton, { size: 'large', onClick: handleDialogOpen, children: _jsx(EditIcon, { fontSize: 'small', color: 'secondary' }) }) }), _jsx(Tooltip, { title: tNodes('actions.delete'), children: _jsx(IconButton, { size: 'large', onClick: function () { return setConfirmOpen(true); }, children: _jsx(Delete, { fontSize: 'small', color: 'secondary' }) }) }), _jsx(TableDialog, { items: items, nodeId: nodeId, isDetails: true, row: row, open: isOpen, handleClose: handleDialogClose }), _jsxs(Dialog, { open: confirmOpen, onClose: function () { return setConfirmOpen(false); }, children: [_jsx(DialogTitle, { children: tNodes('dialogs.deleteRowTitle') }), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: tNodes('confirmations.deleteRow') }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: function () { return setConfirmOpen(false); }, variant: 'contained', children: tCommon('buttons.cancel') }), _jsx(Button, { onClick: handleDeleteConfirmed, color: 'error', variant: 'contained', children: tCommon('buttons.delete') })] })] })] })) }));
};
