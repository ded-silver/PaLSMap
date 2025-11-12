import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { SkeletonNode } from '../SkeletonNode';
export var PNSNode = function (_a) {
    var data = _a.data, id = _a.id, parentId = _a.parentId;
    return (_jsx(_Fragment, { children: _jsx(SkeletonNode, { width: 600, height: 250, variant: 'PNS', id: id, name: data.label, parentId: parentId, isName: true, isData: true }) }));
};
