import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
// Создание контекста с начальным значением
export var DnDContext = createContext(undefined);
// Провайдер контекста
export var DnDProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), type = _b[0], setType = _b[1];
    var value = useMemo(function () { return ({ type: type, setType: setType }); }, [type, setType]);
    return _jsx(DnDContext.Provider, { value: value, children: children });
};
// Хук для использования контекста
export var useDnD = function () {
    var context = useContext(DnDContext);
    if (!context) {
        throw new Error('useDnD must be used within a DnDProvider');
    }
    return context;
};
