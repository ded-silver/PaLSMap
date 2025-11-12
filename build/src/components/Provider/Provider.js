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
import { Background, Controls, ReactFlow, ReactFlowProvider, SelectionMode, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef } from 'react';
import styles from './Provider.module.css';
import { useCreateEdge, useEdges } from '@/entities/edge';
import { useChildNodes } from '@/entities/node';
import { AccountingSystemNode } from '@/entities/node/ui/AccountingSystemNode';
import { CapacityNode } from '@/entities/node/ui/CapacityNode';
import { ChildObjectNode } from '@/entities/node/ui/ChildObjectNode';
import { ChildTankParkNode } from '@/entities/node/ui/ChildTankParkNode';
import { FGUNode } from '@/entities/node/ui/FGUNode';
import { FactoryNode } from '@/entities/node/ui/FactoryNode';
import { KPPSODNode } from '@/entities/node/ui/KPPSODNode';
import { MNSNode } from '@/entities/node/ui/MNSNode';
import { ObjectNode } from '@/entities/node/ui/ObjectNode';
import { PNSNode } from '@/entities/node/ui/PNSNode';
import { PumpNode } from '@/entities/node/ui/PumpNode';
import { SARNode } from '@/entities/node/ui/SARNode';
import { ValveNode } from '@/entities/node/ui/ValveNode';
import { useCreateNode } from '@/features/node-create';
import { useDeleteNode } from '@/features/node-delete';
import { useUpdateNode } from '@/features/node-update';
import { DnDProvider, useDnD } from '@/shared/hooks';
import { DnDSidebar } from '@/widgets/dnd-sidebar';
var nodeTypes = {
    Factory: FactoryNode,
    Object: ObjectNode,
    ChildObject: ChildObjectNode,
    Valve: ValveNode,
    Pump: PumpNode,
    AccountingSystem: AccountingSystemNode,
    ChildTankPark: ChildTankParkNode,
    PNS: PNSNode,
    MNS: MNSNode,
    SAR: SARNode,
    FGU: FGUNode,
    KPPSOD: KPPSODNode,
    Capacity: CapacityNode
};
export var Provider = function (_a) {
    var id = _a.id, currentNodeType = _a.currentNodeType;
    var reactFlowWrapper = useRef(null);
    var items = useChildNodes(id).items;
    var allEgdes = useEdges().items;
    var _b = useNodesState([]), nodes = _b[0], setNodes = _b[1], onNodesChange = _b[2];
    var _c = useEdgesState([]), edges = _c[0], setEdges = _c[1], onEdgesChange = _c[2];
    var _d = useReactFlow(), screenToFlowPosition = _d.screenToFlowPosition, getNodes = _d.getNodes;
    var isAdmin = localStorage.getItem('isAdmin');
    var type = useDnD().type;
    var node = useCreateNode().mutate;
    var deleteNode = useDeleteNode(['childNodes']).mutate;
    var nodeUpdate = useUpdateNode(['childNodes']).mutate;
    var handleCreate = function (data) {
        node(data);
    };
    var handleNodesDelete = useCallback(function (deletedNodes) {
        deletedNodes.forEach(function (node) {
            deleteNode(node.id);
        });
    }, []);
    useEffect(function () {
        if (items) {
            var updatedNodes = items.map(function (item) {
                var _a, _b;
                return (__assign(__assign({}, item), { style: {
                        width: (_a = item.measured) === null || _a === void 0 ? void 0 : _a.width,
                        height: (_b = item.measured) === null || _b === void 0 ? void 0 : _b.height
                    } }));
            });
            setNodes(updatedNodes);
        }
    }, [items]);
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
    //Добавление эджей
    var createEdge = useCreateEdge().mutate;
    useEffect(function () {
        if (allEgdes) {
            setEdges(allEgdes);
        }
    }, [allEgdes]);
    var onConnect = useCallback(function (params) {
        if (params.targetHandle) {
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
    // Обработчик для перетаскивания узлов
    var onDrop = useCallback(function (event) {
        event.preventDefault();
        event.stopPropagation();
        var position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });
        if (!type)
            return;
        // Используем состояние для имени узла
        var newNode = {
            id: nanoid(),
            type: type,
            position: position,
            data: {
                label: '',
                tableName: [], // Имя узла из состояния
                tableData: [],
                handlers: [
                    {
                        id: nanoid(),
                        type: 'source'
                    },
                    {
                        id: nanoid(),
                        type: 'target'
                    }
                ]
            }
        };
        handleCreate(__assign(__assign({}, newNode), { parentId: id }));
    }, [screenToFlowPosition, type]);
    // Обработчик события перетаскивания
    var onDragOver = useCallback(function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles['provider-content'], ref: reactFlowWrapper, onDrop: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, onDragOver: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, style: { zIndex: 9999, backgroundColor: '#e6f0ff' }, children: _jsxs(ReactFlow, { nodes: nodes, edges: edges, nodeTypes: nodeTypes, onConnect: onConnect, onDrop: onDrop, onDragOver: onDragOver, onNodesChange: onNodesChangeWithDebounce, onEdgesChange: onEdgesChange, onNodesDelete: handleNodesDelete, snapToGrid: true, snapGrid: [25, 25], className: 'react-flow-subflows-example', fitView: true, deleteKeyCode: null, selectionMode: SelectionMode.Partial, style: {
                        backgroundColor: '#F7F9FB',
                        width: '100%',
                        height: '400px'
                    }, nodesDraggable: isAdmin === 'true' ? true : false, nodesConnectable: isAdmin === 'true' ? true : false, 
                    // elementsSelectable={isAdmin === 'true' ? true : false}
                    edgesFocusable: isAdmin === 'true' ? true : false, nodesFocusable: isAdmin === 'true' ? true : false, children: [_jsx(Controls, {}), _jsx(Background, { color: '#E6E6E6' })] }) }), _jsx(DnDSidebar, { currentNodeType: currentNodeType })] }));
};
export default (function (_a) {
    var id = _a.id, currentNodeType = _a.currentNodeType;
    return (_jsx(ReactFlowProvider, { children: _jsx(DnDProvider, { children: _jsx(Provider, { id: id, currentNodeType: currentNodeType }) }) }));
});
