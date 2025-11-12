import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { NodeDataService } from './api';
export function useGetNodeData(id) {
    var _a = useQuery({
        queryKey: ['currentNodeData', id],
        queryFn: function () { return NodeDataService.getNodeData(id); }
    }), data = _a.data, isLoading = _a.isLoading;
    var _b = useState([]), items = _b[0], setItems = _b[1];
    useEffect(function () {
        if (data) {
            setItems(data);
        }
    }, [data]);
    return { items: items, setItems: setItems, isLoading: isLoading };
}
