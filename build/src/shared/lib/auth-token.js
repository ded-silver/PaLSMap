export var EnumTokens;
(function (EnumTokens) {
    EnumTokens["ACCESS_TOKEN"] = "accessToken";
    EnumTokens["REFRESH_TOKEN"] = "refreshToken";
})(EnumTokens || (EnumTokens = {}));
export var getAccessToken = function () {
    var accessToken = localStorage.getItem('accesstoken');
    return accessToken || null;
};
export var saveTokenStorage = function (accessToken) {
    localStorage.setItem('accesstoken', accessToken);
};
export var removeFromStorage = function () {
    localStorage.removeItem('accesstoken');
};
