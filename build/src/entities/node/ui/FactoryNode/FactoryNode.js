import { jsx as _jsx } from "react/jsx-runtime";
import { SkeletonNode } from '../SkeletonNode';
export var FactoryNode = function (_a) {
    var data = _a.data, id = _a.id, parentId = _a.parentId;
    return (_jsx(SkeletonNode, { id: id, width: 1200, height: 1200, variant: 'Factory', name: data.label, parentId: parentId }));
};
