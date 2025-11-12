import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, CircularProgress, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Dictionary.module.css';
import { DeleteConfirmDialog, DictionaryItem, DictionaryModal } from '@/entities/dictionary';
import { useCreateDictionary, useDeleteDictionary, useDictionaries, useUpdateDictionary } from '@/entities/dictionary';
import { SearchBar } from '@/shared/ui';
export var DictionaryPage = function () {
    var t = useTranslation(['common', 'dictionary']).t;
    var _a = useState(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = useState(false), isModalOpen = _b[0], setIsModalOpen = _b[1];
    var _c = useState(false), isDeleteDialogOpen = _c[0], setIsDeleteDialogOpen = _c[1];
    var _d = useState(null), selectedItem = _d[0], setSelectedItem = _d[1];
    var _e = useState('create'), modalMode = _e[0], setModalMode = _e[1];
    var isAdmin = localStorage.getItem('isAdmin') === 'true';
    var _f = useDictionaries(), data = _f.data, isLoading = _f.isLoading, error = _f.error;
    var _g = useCreateDictionary(), createDictionary = _g.mutate, isCreating = _g.isPending;
    var _h = useUpdateDictionary(), updateDictionary = _h.mutate, isUpdating = _h.isPending;
    var _j = useDeleteDictionary(), deleteDictionary = _j.mutate, isDeleting = _j.isPending;
    var dictionaries = (data === null || data === void 0 ? void 0 : data.items) || [];
    var filteredDictionaries = useMemo(function () {
        if (!searchTerm.trim()) {
            return dictionaries;
        }
        var searchLower = searchTerm.toLowerCase();
        return dictionaries.filter(function (_a) {
            var short = _a.short, full = _a.full;
            return short.toLowerCase().includes(searchLower) ||
                full.toLowerCase().includes(searchLower);
        });
    }, [dictionaries, searchTerm]);
    var handleAdd = function () {
        setModalMode('create');
        setSelectedItem(null);
        setIsModalOpen(true);
    };
    var handleEdit = function (item) {
        setModalMode('edit');
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    var handleDelete = function (id) {
        var item = dictionaries.find(function (d) { return d.id === id; });
        if (item) {
            setSelectedItem(item);
            setIsDeleteDialogOpen(true);
        }
    };
    var handleModalSubmit = function (data) {
        if (modalMode === 'create') {
            createDictionary(data, {
                onSuccess: function () {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }
            });
        }
        else if (selectedItem) {
            updateDictionary({ id: selectedItem.id, dto: data }, {
                onSuccess: function () {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }
            });
        }
    };
    var handleDeleteConfirm = function () {
        if (selectedItem) {
            deleteDictionary(selectedItem.id, {
                onSuccess: function () {
                    setIsDeleteDialogOpen(false);
                    setSelectedItem(null);
                }
            });
        }
    };
    var handleModalClose = function () {
        setIsModalOpen(false);
        setSelectedItem(null);
    };
    var handleDeleteDialogClose = function () {
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
    };
    if (error) {
        return (_jsxs("div", { className: styles['main-content'], children: [_jsx(Typography, { sx: { fontSize: '2.125rem' }, className: styles.pageTitle, gutterBottom: true, children: t('title', { ns: 'dictionary' }) }), _jsx("div", { className: styles.noResults, children: t('errors.loadError', { ns: 'common' }) })] }));
    }
    return (_jsxs("div", { className: styles['main-content'], children: [_jsx(Typography, { sx: { fontSize: '2.125rem' }, className: styles.pageTitle, gutterBottom: true, children: t('title', { ns: 'dictionary' }) }), _jsx("div", { className: styles.header, children: _jsxs("div", { className: styles.searchAndActions, children: [_jsx("div", { className: styles.searchBarWrapper, children: _jsx(SearchBar, { placeholder: t('placeholders.searchAbbreviations', {
                                    ns: 'common'
                                }), onChange: function (e) { return setSearchTerm(e.target.value); } }) }), isAdmin && (_jsx(Button, { variant: 'contained', color: 'primary', onClick: handleAdd, className: styles.addButton, children: t('buttons.add', { ns: 'dictionary' }) }))] }) }), isLoading ? (_jsx("div", { className: styles.loading, children: _jsx(CircularProgress, {}) })) : filteredDictionaries.length > 0 ? (_jsx("div", { className: styles.abbreviationList, children: filteredDictionaries.map(function (item) { return (_jsx(DictionaryItem, { item: item, isAdmin: isAdmin, onEdit: handleEdit, onDelete: handleDelete }, item.id)); }) })) : dictionaries.length === 0 ? (_jsx("div", { className: styles.noResults, children: t('messages.empty', { ns: 'dictionary' }) })) : (_jsx("div", { className: styles.noResults, children: t('messages.noResults', { ns: 'dictionary' }) })), _jsx(DictionaryModal, { isOpen: isModalOpen, mode: modalMode, item: selectedItem || undefined, onClose: handleModalClose, onSubmit: handleModalSubmit, isLoading: isCreating || isUpdating }), selectedItem && (_jsx(DeleteConfirmDialog, { isOpen: isDeleteDialogOpen, item: selectedItem, onClose: handleDeleteDialogClose, onConfirm: handleDeleteConfirm, isLoading: isDeleting }))] }));
};
