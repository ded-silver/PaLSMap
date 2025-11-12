import { useCallback, useState } from 'react';
export var useDialog = function () {
    var _a = useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var handleDialogOpen = useCallback(function () {
        setIsOpen(true);
    }, []);
    var handleDialogClose = useCallback(function () {
        setIsOpen(false);
    }, []);
    return { isOpen: isOpen, handleDialogOpen: handleDialogOpen, handleDialogClose: handleDialogClose };
};
