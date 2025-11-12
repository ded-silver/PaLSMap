import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { NodeService } from '@/entities/node';
export var useCreateNode = function () {
    var queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['node'],
        mutationFn: function (data) { return NodeService.create(data); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['nodes'] });
            toast.success(i18n.t('messages.addSuccess', { ns: 'nodes' }));
        },
        onError: function () { return toast.error(i18n.t('messages.addError', { ns: 'nodes' })); }
    });
};
