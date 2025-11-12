import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { SkeletonNode } from '../SkeletonNode';
export var KPPSODNode = function (_a) {
    var data = _a.data, id = _a.id, parentId = _a.parentId;
    return (_jsx(_Fragment, { children: _jsx(SkeletonNode, { width: 150, height: 150, variant: 'KPPSOD', id: id, name: data.label, parentId: parentId, isName: true, isData: true }) }));
};
