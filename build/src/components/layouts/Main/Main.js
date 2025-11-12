var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Typography } from '@mui/material';
import { Controls, ReactFlow, ReactFlowProvider, SelectionMode, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Main.module.css';
import { useCreateEdge, useDeleteEdge, useEdges } from '@/entities/edge';
import { useNodes } from '@/entities/node';
import { CheckpointNode } from '@/entities/node/ui/CheckpointNode';
import { OPSNode } from '@/entities/node/ui/OPSNode';
import { River } from '@/entities/node/ui/River';
import { TankParkNode } from '@/entities/node/ui/TankParkNode';
import { useCreateNode } from '@/features/node-create';
import { useDeleteNode } from '@/features/node-delete';
import { useUpdateNode } from '@/features/node-update';
import { DnDProvider, useDnD } from '@/shared/hooks';
import { DnDSidebar } from '@/widgets/dnd-sidebar';
var nodeTypes = {
    OPS: OPSNode,
    TankPark: TankParkNode,
    Checkpoint: CheckpointNode,
    River: River
};
var MMMain = function (_a) {
    var _b;
    var isSidebarOpen = _a.isSidebarOpen;
    var t = useTranslation(['common', 'nodes']).t;
    var reactFlowWrapper = useRef(null);
    var edgeReconnectSuccessful = useRef(true);
    var items = useNodes().items;
    var allEgdes = useEdges().items;
    var _c = useNodesState([]), nodes = _c[0], setNodes = _c[1], onNodesChange = _c[2];
    var _d = useEdgesState([]), edges = _d[0], setEdges = _d[1], onEdgesChange = _d[2];
    var _e = useReactFlow(), screenToFlowPosition = _e.screenToFlowPosition, getNodes = _e.getNodes;
    var isAdmin = localStorage.getItem('isAdmin');
    var deleteEdge = useDeleteEdge().mutate;
    var node = useCreateNode().mutate;
    var deleteNode = useDeleteNode().mutate;
    var nodeUpdate = useUpdateNode().mutate;
    var type = useDnD().type;
    var handleCreate = function (data) {
        node(data);
    };
    var createEdge = useCreateEdge().mutate;
    // Создание нового ребра
    var onConnect = useCallback(function (params) {
        if (params.targetHandle && 'source' in params && 'target' in params) {
            var edge_1 = __assign(__assign({}, params), { type: 'straight', id: nanoid(), style: {
                    strokeWidth: 1,
                    stroke: 'black'
                } });
            setEdges(function (eds) { return __spreadArray(__spreadArray([], eds, true), [edge_1], false); });
            createEdge({
                id: edge_1.id,
                source: edge_1.source,
                target: edge_1.target,
                sourceHandle: edge_1.sourceHandle || null,
                targetHandle: edge_1.targetHandle || null
            });
        }
    }, [setEdges, createEdge]);
    // Удаление ребра при сбросе на пустое место
    var onReconnectStart = useCallback(function () {
        edgeReconnectSuccessful.current = false;
    }, []);
    var onReconnect = useCallback(function (oldEdge, newConnection) {
        edgeReconnectSuccessful.current = true;
        setEdges(function (eds) {
            return eds.map(function (edge) {
                return edge.id === oldEdge.id
                    ? __assign(__assign({}, edge), { source: newConnection.source, target: newConnection.target, sourceHandle: newConnection.sourceHandle, targetHandle: newConnection.targetHandle }) : edge;
            });
        });
    }, [setEdges]);
    var onReconnectEnd = useCallback(function (_, edge) {
        if (!edgeReconnectSuccessful.current) {
            setEdges(function (eds) { return eds.filter(function (e) { return e.id !== edge.id; }); });
            deleteEdge(edge.id);
        }
        edgeReconnectSuccessful.current = true;
    }, [setEdges, deleteEdge]);
    // Drop нового узла
    var onDrop = useCallback(function (event) {
        event.preventDefault();
        var position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });
        if (!type)
            return;
        var newNode = {
            id: nanoid(),
            type: type,
            position: position,
            data: {
                label: '',
                tableName: [],
                tableData: [],
                handlers: [
                    { id: nanoid(), type: 'source' },
                    { id: nanoid(), type: 'target' }
                ]
            }
        };
        handleCreate(newNode);
    }, [screenToFlowPosition, type]);
    var onDragOver = useCallback(function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    var handleNodesDelete = useCallback(function (deletedNodes) {
        deletedNodes.forEach(function (node) {
            deleteNode(node.id);
        });
    }, []);
    useEffect(function () {
        if (items)
            setNodes(items);
    }, [items]);
    useEffect(function () {
        if (allEgdes)
            setEdges(allEgdes);
    }, [allEgdes]);
    var handleNodeUpdate = useCallback(debounce(function (changes, allNodes) {
        var updatedNodes = changes
            .filter(function (change) { return change.type === 'position'; })
            .map(function (change) { return allNodes.find(function (node) { return node.id === change.id; }); })
            .filter(Boolean);
        updatedNodes.forEach(function (node) {
            nodeUpdate(node);
        });
    }, 500), []);
    var onNodesChangeWithDebounce = useCallback(function (changes) {
        onNodesChange(changes);
        var currentNodes = getNodes();
        handleNodeUpdate(changes, currentNodes);
    }, [onNodesChange, getNodes]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles['main-content'], ref: reactFlowWrapper, style: { backgroundColor: '#e6f0ff' }, children: [_jsx(Typography, { variant: 'h4', className: clsx(styles.pageTitle, (_b = {}, _b[styles.open] = isSidebarOpen, _b)), zIndex: 10, children: t('titles.main') }), _jsx(ReactFlow, { nodes: nodes, edges: edges, nodeTypes: nodeTypes, onConnect: onConnect, onDrop: onDrop, onDragOver: onDragOver, onNodesChange: onNodesChangeWithDebounce, onEdgesChange: onEdgesChange, onNodesDelete: handleNodesDelete, onReconnectStart: onReconnectStart, onReconnect: onReconnect, onReconnectEnd: onReconnectEnd, snapToGrid: true, deleteKeyCode: ['Delete'], snapGrid: [25, 25], selectionMode: SelectionMode.Partial, fitView: true, nodesDraggable: isAdmin === 'true', nodesConnectable: isAdmin === 'true', edgesFocusable: isAdmin === 'true', nodesFocusable: isAdmin === 'true', children: _jsx(Controls, {}) }), _jsxs("div", { className: styles.compass, children: [_jsx("div", { className: styles.needle }), _jsx("div", { className: styles.labelNorth, children: "\u0421" }), _jsx("div", { className: styles.labelSouth, children: "\u042E" }), _jsx("div", { className: styles.labelWest, children: "\u0417" }), _jsx("div", { className: styles.labelEast, children: "\u0412" })] })] }), _jsx(DnDSidebar, {})] }));
};
export default (function (_a) {
    var isSidebarOpen = _a.isSidebarOpen;
    return (_jsx(ReactFlowProvider, { children: _jsx(DnDProvider, { children: _jsx(MMMain, { isSidebarOpen: isSidebarOpen }) }) }));
});
