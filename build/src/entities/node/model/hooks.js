import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { NodeService } from './api';
export function useNodes() {
    var data = useQuery({
        queryKey: ['nodes'],
        queryFn: function () { return NodeService.getAll(); }
    }).data;
    var _a = useState(data), items = _a[0], setItems = _a[1];
    useEffect(function () {
        setItems(data);
    }, [data]);
    return { items: items, setItems: setItems };
}
export function useChildNodes(id) {
    var data = useQuery({
        queryKey: ['childNodes', id],
        queryFn: function () { return NodeService.getChildren(id); }
    }).data;
    var _a = useState(data), items = _a[0], setItems = _a[1];
    useEffect(function () {
        setItems(data);
    }, [data]);
    return { items: items, setItems: setItems };
}
export function useNodeById(id) {
    var _a = useQuery({
        queryKey: ['currentNode', id],
        queryFn: function () { return NodeService.getById(id); }
    }), data = _a.data, isLoading = _a.isLoading;
    var _b = useState(data), item = _b[0], setItem = _b[1];
    useEffect(function () {
        setItem(data);
    }, [data]);
    return { item: item, setItem: setItem, isLoading: isLoading };
}
