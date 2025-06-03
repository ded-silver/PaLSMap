import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { EdgeService } from '../../services/edge.service';

export const useCreateEdge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EdgeService.create,
    onSuccess: () => {
      toast.success('Связь успешно создана');
      queryClient.invalidateQueries({ queryKey: ['edges'] });
    },
    onError: () => {
      toast.error('Ошибка при создании связи');
    },
  });
};
