import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { NodeService } from '@/entities/node';
export var useDeleteNode = function (queryKey) {
    if (queryKey === void 0) { queryKey = ['nodes']; }
    var queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteNode'],
        mutationFn: function (id) { return NodeService.delete(id); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: function () {
            return toast.error(i18n.t('messages.deleteNodeError', { ns: 'nodes' }));
        }
    });
};
