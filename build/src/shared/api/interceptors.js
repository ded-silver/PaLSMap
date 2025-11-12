var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from 'axios';
import { errorCatch } from './error';
import { authService } from '@/entities/user';
import { getAccessToken, removeFromStorage } from '@/shared/lib/auth-token';
var options = {
    baseURL: "http://localhost:4201/api",
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
};
var axiosClassic = axios.create(options);
var axiosWithAuth = axios.create(options);
axiosWithAuth.interceptors.request.use(function (config) {
    var accessToken = getAccessToken();
    if ((config === null || config === void 0 ? void 0 : config.headers) && accessToken)
        config.headers.Authorization = "Bearer ".concat(accessToken);
    return config;
});
axiosWithAuth.interceptors.response.use(function (config) { return config; }, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var originalRequest, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                originalRequest = error.config;
                if (!((((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 ||
                    errorCatch(error) === 'jwt expired' ||
                    errorCatch(error) === 'jwt must be provided') &&
                    error.config &&
                    !error.config._isRetry)) return [3 /*break*/, 4];
                originalRequest._isRetry = true;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, authService.getNewTokens()];
            case 2:
                _b.sent();
                return [2 /*return*/, axiosWithAuth.request(originalRequest)];
            case 3:
                error_1 = _b.sent();
                if (errorCatch(error_1) === 'jwt expired')
                    removeFromStorage();
                return [3 /*break*/, 4];
            case 4: throw error;
        }
    });
}); });
export { axiosClassic, axiosWithAuth };
