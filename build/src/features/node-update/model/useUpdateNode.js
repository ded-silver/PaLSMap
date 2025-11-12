import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { NodeService } from '@/entities/node';
export var useUpdateNode = function (queryKey) {
    if (queryKey === void 0) { queryKey = ['nodes']; }
    var queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['nodeUpdate'],
        mutationFn: function (data) { return NodeService.update(data.id, data); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: function () { return toast.error(i18n.t('messages.updateError', { ns: 'nodes' })); }
    });
};
