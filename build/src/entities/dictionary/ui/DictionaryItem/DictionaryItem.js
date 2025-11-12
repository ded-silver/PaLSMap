import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from './DictionaryItem.module.css';
export var DictionaryItem = function (_a) {
    var item = _a.item, isAdmin = _a.isAdmin, onEdit = _a.onEdit, onDelete = _a.onDelete;
    var t = useTranslation('common').t;
    return (_jsxs("div", { className: "".concat(styles.item, " ").concat(isAdmin ? styles.hasActions : ''), children: [_jsx("div", { className: styles.short, children: item.short }), _jsx("div", { className: styles.full, children: item.full }), isAdmin && (_jsxs("div", { className: styles.actions, children: [_jsx(IconButton, { size: 'small', onClick: function () { return onEdit(item); }, "aria-label": t('buttons.edit'), className: styles.editButton, children: _jsx(EditIcon, { fontSize: 'small' }) }), _jsx(IconButton, { size: 'small', onClick: function () { return onDelete(item.id); }, "aria-label": t('buttons.delete'), className: styles.deleteButton, children: _jsx(DeleteIcon, { fontSize: 'small' }) })] }))] }));
};
