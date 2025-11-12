import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { dictionaryApi } from './api';
export var useDictionaries = function (search) {
    return useQuery({
        queryKey: ['dictionaries', search],
        queryFn: function () { return dictionaryApi.getAll(search); },
        staleTime: 5 * 60 * 1000 // 5 минут
    });
};
export var useDictionary = function (id) {
    return useQuery({
        queryKey: ['dictionary', id],
        queryFn: function () { return dictionaryApi.getById(id); },
        enabled: !!id
    });
};
export var useCreateDictionary = function () {
    var queryClient = useQueryClient();
    return useMutation({
        mutationFn: function (dto) { return dictionaryApi.create(dto); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['dictionaries'] });
            toast.success(i18n.t('messages.createSuccess', { ns: 'dictionary' }));
        },
        onError: function (error) {
            var _a, _b, _c, _d, _e;
            var errorMessage = i18n.t('messages.createError', { ns: 'dictionary' });
            if ((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
                errorMessage = error.response.data.message;
            }
            else if (((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) === 409) {
                errorMessage = i18n.t('messages.duplicateError', { ns: 'dictionary' });
            }
            else if (((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.status) === 403) {
                errorMessage = i18n.t('messages.forbiddenError', { ns: 'dictionary' });
            }
            else if (((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.status) === 401) {
                errorMessage = i18n.t('messages.unauthorizedError', {
                    ns: 'dictionary'
                });
            }
            toast.error(errorMessage);
        }
    });
};
export var useUpdateDictionary = function () {
    var queryClient = useQueryClient();
    return useMutation({
        mutationFn: function (_a) {
            var id = _a.id, dto = _a.dto;
            return dictionaryApi.update(id, dto);
        },
        onSuccess: function (_, variables) {
            queryClient.invalidateQueries({ queryKey: ['dictionaries'] });
            queryClient.invalidateQueries({
                queryKey: ['dictionary', variables.id]
            });
            toast.success(i18n.t('messages.updateSuccess', { ns: 'dictionary' }));
        },
        onError: function (error) {
            var _a, _b, _c, _d, _e, _f;
            var errorMessage = i18n.t('messages.updateError', { ns: 'dictionary' });
            if ((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
                errorMessage = error.response.data.message;
            }
            else if (((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) === 409) {
                errorMessage = i18n.t('messages.duplicateError', { ns: 'dictionary' });
            }
            else if (((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.status) === 403) {
                errorMessage = i18n.t('messages.forbiddenError', { ns: 'dictionary' });
            }
            else if (((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.status) === 401) {
                errorMessage = i18n.t('messages.unauthorizedError', {
                    ns: 'dictionary'
                });
            }
            else if (((_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.status) === 404) {
                errorMessage = i18n.t('messages.notFoundError', { ns: 'dictionary' });
            }
            toast.error(errorMessage);
        }
    });
};
export var useDeleteDictionary = function () {
    var queryClient = useQueryClient();
    return useMutation({
        mutationFn: function (id) { return dictionaryApi.delete(id); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['dictionaries'] });
            toast.success(i18n.t('messages.deleteSuccess', { ns: 'dictionary' }));
        },
        onError: function (error) {
            var _a, _b, _c, _d, _e;
            var errorMessage = i18n.t('messages.deleteError', { ns: 'dictionary' });
            if ((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
                errorMessage = error.response.data.message;
            }
            else if (((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) === 403) {
                errorMessage = i18n.t('messages.forbiddenError', { ns: 'dictionary' });
            }
            else if (((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.status) === 401) {
                errorMessage = i18n.t('messages.unauthorizedError', {
                    ns: 'dictionary'
                });
            }
            else if (((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.status) === 404) {
                errorMessage = i18n.t('messages.notFoundError', { ns: 'dictionary' });
            }
            toast.error(errorMessage);
        }
    });
};
