import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EdgeService } from './api';
export function useEdges() {
    var data = useQuery({
        queryKey: ['edges'],
        queryFn: function () { return EdgeService.getAll(); }
    }).data;
    var _a = useState(data), items = _a[0], setItems = _a[1];
    useEffect(function () {
        setItems(data);
    }, [data]);
    return { items: items, setItems: setItems };
}
export var useCreateEdge = function () {
    var queryClient = useQueryClient();
    return useMutation({
        mutationFn: EdgeService.create,
        onSuccess: function () {
            toast.success(i18n.t('messages.createEdgeSuccess', { ns: 'nodes' }));
            queryClient.invalidateQueries({ queryKey: ['edges'] });
        },
        onError: function () {
            toast.error(i18n.t('messages.createEdgeError', { ns: 'nodes' }));
        }
    });
};
export var useDeleteEdge = function () {
    var queryClient = useQueryClient();
    return useMutation({
        mutationFn: function (id) { return EdgeService.delete(id); },
        onSuccess: function () {
            toast.success(i18n.t('messages.deleteEdgeSuccess', { ns: 'nodes' }));
            queryClient.invalidateQueries({ queryKey: ['edges'] });
        },
        onError: function () {
            toast.error(i18n.t('messages.deleteEdgeError', { ns: 'nodes' }));
        }
    });
};
