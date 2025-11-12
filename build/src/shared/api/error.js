export var errorCatch = function (error) {
    var _a, _b;
    var message = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message;
    return message
        ? typeof error.response.data.message === 'object'
            ? message[0]
            : message
        : error.message;
};
