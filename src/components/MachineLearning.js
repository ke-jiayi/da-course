"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_ace_1 = require("react-ace");
require("ace-builds/src-noconflict/mode-python");
require("ace-builds/src-noconflict/theme-monokai");
require("ace-builds/src-noconflict/ext-language_tools");
var pyodideService_1 = require("../services/pyodideService");
var MachineLearning = function () {
    var _a = (0, react_1.useState)(''), code = _a[0], setCode = _a[1];
    var _b = (0, react_1.useState)(null), result = _b[0], setResult = _b[1];
    var handleCodeChange = function (newCode) {
        setCode(newCode);
        setResult(null);
    };
    var handleRunCode = function () { return __awaiter(void 0, void 0, void 0, function () {
        var executionResult, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!code.trim()) {
                        setResult({
                            success: false,
                            stdout: '',
                            stderr: '',
                            error: {
                                type: 'InputError',
                                message: '请输入代码后再运行'
                            }
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, pyodideService_1.runPythonCode)(code)];
                case 2:
                    executionResult = _a.sent();
                    setResult(executionResult);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setResult({
                        success: false,
                        stdout: '',
                        stderr: '',
                        error: {
                            type: 'ExecutionError',
                            message: '执行错误: ' + err_1.message
                        }
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var defaultCode = "# \u673A\u5668\u5B66\u4E60\u57FA\u7840\u793A\u4F8B\nprint(\"\u6B22\u8FCE\u5B66\u4E60\u673A\u5668\u5B66\u4E60\uFF01\")\nprint(\"\n\u5728\u8FD9\u4E2A\u8BFE\u7A0B\u4E2D\uFF0C\u4F60\u5C06\u5B66\u4E60\uFF1A\")\nprint(\"1. \u673A\u5668\u5B66\u4E60\u57FA\u672C\u6982\u5FF5\")\nprint(\"2. \u76D1\u7763\u4E0E\u975E\u76D1\u7763\u5B66\u4E60\")\nprint(\"3. \u6A21\u578B\u8BC4\u4F30\u65B9\u6CD5\")\n\n# \u7B80\u5355\u7684\u6570\u503C\u8BA1\u7B97\u793A\u4F8B\nX = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\n\nprint(\"\u7279\u5F81\u503C X:\", X)\nprint(\"\u76EE\u6807\u503C y:\", y)\n\n# \u8BA1\u7B97\u7B80\u5355\u7684\u5173\u7CFB\nprint(\"\n\u89C2\u5BDF\u53D1\u73B0\uFF0Cy \u662F x \u7684 2 \u500D\uFF01\")\nprint(\"\u8FD9\u662F\u4E00\u4E2A\u7B80\u5355\u7684\u7EBF\u6027\u5173\u7CFB\")";
    return (react_1.default.createElement("div", { className: "min-h-screen bg-background" },
        react_1.default.createElement("div", { className: "container mx-auto px-4 py-8" },
            react_1.default.createElement("div", { className: "bg-white rounded-2xl shadow-cute p-6 md:p-8" },
                react_1.default.createElement("h1", { className: "text-2xl md:text-3xl font-bold mb-6 text-primary" }, "Python\u7F16\u7A0B \u673A\u5668\u5B66\u4E60\u7B97\u6CD5\u7EC3\u4E60"),
                react_1.default.createElement("div", { className: "mb-10" },
                    react_1.default.createElement("div", { className: "bg-accent rounded-xl p-6 mb-6" },
                        react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4 text-primary" }, "\u5B66\u4E60\u76EE\u6807"),
                        react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2 text-text" },
                            react_1.default.createElement("li", null, "\u7406\u89E3\u673A\u5668\u5B66\u4E60\u7684\u57FA\u672C\u6982\u5FF5\u548C\u539F\u7406"),
                            react_1.default.createElement("li", null, "\u638C\u63E1\u76D1\u7763\u5B66\u4E60\u548C\u65E0\u76D1\u7763\u5B66\u4E60\u7684\u533A\u522B"),
                            react_1.default.createElement("li", null, "\u4E86\u89E3\u5E38\u89C1\u7684\u673A\u5668\u5B66\u4E60\u7B97\u6CD5\u7C7B\u578B"),
                            react_1.default.createElement("li", null, "\u5B66\u4E60\u6A21\u578B\u8BC4\u4F30\u548C\u6539\u8FDB\u7684\u57FA\u672C\u65B9\u6CD5")))),
                react_1.default.createElement("div", { className: "mb-10" },
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4 text-primary" }, "\u524D\u7F6E\u77E5\u8BC6"),
                    react_1.default.createElement("div", { className: "bg-yellow rounded-xl p-6" },
                        react_1.default.createElement("p", { className: "text-text" }, "\u57FA\u7840\u6570\u5B66\u77E5\u8BC6\uFF08\u4EE3\u6570\u3001\u7EDF\u8BA1\uFF09\u3001\u57FA\u7840\u7F16\u7A0B\u601D\u7EF4"))),
                react_1.default.createElement("div", { className: "mb-10" },
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-6 text-primary" }, "\u8BFE\u7A0B\u5185\u5BB9"),
                    react_1.default.createElement("div", { className: "mb-8" },
                        react_1.default.createElement("div", { className: "flex items-center mb-4" },
                            react_1.default.createElement("div", { className: "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3" }, "1"),
                            react_1.default.createElement("h3", { className: "text-lg font-semibold text-text" }, "\u673A\u5668\u5B66\u4E60\u57FA\u7840\u6982\u5FF5")),
                        react_1.default.createElement("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm" },
                            react_1.default.createElement("div", { className: "text-text mb-4" },
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u4EC0\u4E48\u662F\u673A\u5668\u5B66\u4E60\uFF1F")),
                                react_1.default.createElement("p", { className: "mb-3" }, "\u673A\u5668\u5B66\u4E60\u662F\u4EBA\u5DE5\u667A\u80FD\u7684\u4E00\u4E2A\u5206\u652F\uFF0C\u5B83\u4F7F\u8BA1\u7B97\u673A\u7CFB\u7EDF\u80FD\u591F\u901A\u8FC7\u7ECF\u9A8C\u81EA\u52A8\u6539\u8FDB\uFF0C\u800C\u65E0\u9700\u660E\u786E\u7F16\u7A0B\u3002"),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u673A\u5668\u5B66\u4E60\u7684\u7C7B\u578B\uFF1A")),
                                react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u76D1\u7763\u5B66\u4E60"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u4F7F\u7528\u6807\u8BB0\u6570\u636E\u8FDB\u884C\u8BAD\u7EC3\uFF0C\u5B66\u4E60\u8F93\u5165\u4E0E\u8F93\u51FA\u4E4B\u95F4\u7684\u6620\u5C04\u5173\u7CFB\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u65E0\u76D1\u7763\u5B66\u4E60"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u4F7F\u7528\u672A\u6807\u8BB0\u6570\u636E\uFF0C\u53D1\u73B0\u6570\u636E\u4E2D\u7684\u9690\u85CF\u6A21\u5F0F\u548C\u7ED3\u6784\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u5F3A\u5316\u5B66\u4E60"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u901A\u8FC7\u5956\u52B1\u548C\u60E9\u7F5A\u673A\u5236\uFF0C\u8BA9\u667A\u80FD\u4F53\u5B66\u4E60\u6700\u4F18\u51B3\u7B56\u7B56\u7565\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u6DF1\u5EA6\u5B66\u4E60"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u4F7F\u7528\u591A\u5C42\u795E\u7ECF\u7F51\u7EDC\uFF0C\u81EA\u52A8\u5B66\u4E60\u590D\u6742\u7684\u7279\u5F81\u8868\u793A\u3002"))),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u673A\u5668\u5B66\u4E60\u6D41\u7A0B\uFF1A")),
                                react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2" },
                                    react_1.default.createElement("li", null, "\u6570\u636E\u6536\u96C6\u548C\u9884\u5904\u7406"),
                                    react_1.default.createElement("li", null, "\u7279\u5F81\u5DE5\u7A0B"),
                                    react_1.default.createElement("li", null, "\u6A21\u578B\u9009\u62E9\u548C\u8BAD\u7EC3"),
                                    react_1.default.createElement("li", null, "\u6A21\u578B\u8BC4\u4F30"),
                                    react_1.default.createElement("li", null, "\u6A21\u578B\u90E8\u7F72\u548C\u4F18\u5316"))))),
                    react_1.default.createElement("div", { className: "mb-8" },
                        react_1.default.createElement("div", { className: "flex items-center mb-4" },
                            react_1.default.createElement("div", { className: "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3" }, "2"),
                            react_1.default.createElement("h3", { className: "text-lg font-semibold text-text" }, "\u7EBF\u6027\u56DE\u5F52\u5B9E\u6218")),
                        react_1.default.createElement("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm" },
                            react_1.default.createElement("div", { className: "text-text mb-4" },
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u4EC0\u4E48\u662F\u7EBF\u6027\u56DE\u5F52\uFF1F")),
                                react_1.default.createElement("p", { className: "mb-3" }, "\u7EBF\u6027\u56DE\u5F52\u662F\u6700\u57FA\u7840\u7684\u76D1\u7763\u5B66\u4E60\u7B97\u6CD5\uFF0C\u7528\u4E8E\u9884\u6D4B\u8FDE\u7EED\u503C\u3002"),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u5DE5\u4F5C\u539F\u7406\uFF1A")),
                                react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2 mb-4" },
                                    react_1.default.createElement("li", null, "\u627E\u5230\u4E00\u6761\u6700\u62DF\u5408\u6570\u636E\u7684\u76F4\u7EBF"),
                                    react_1.default.createElement("li", null, "\u6700\u5C0F\u5316\u9884\u6D4B\u503C\u4E0E\u5B9E\u9645\u503C\u7684\u5DEE\u8DDD"),
                                    react_1.default.createElement("li", null, "\u6570\u5B66\u8868\u793A\uFF1Ay = wx + b")),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u5E38\u89C1\u5E94\u7528\uFF1A")),
                                react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2" },
                                    react_1.default.createElement("li", null, "\u623F\u4EF7\u9884\u6D4B"),
                                    react_1.default.createElement("li", null, "\u9500\u552E\u9884\u6D4B"),
                                    react_1.default.createElement("li", null, "\u5B66\u751F\u6210\u7EE9\u9884\u6D4B"),
                                    react_1.default.createElement("li", null, "\u533B\u7597\u8D39\u7528\u4F30\u8BA1"))))),
                    react_1.default.createElement("div", { className: "mb-8" },
                        react_1.default.createElement("div", { className: "flex items-center mb-4" },
                            react_1.default.createElement("div", { className: "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3" }, "3"),
                            react_1.default.createElement("h3", { className: "text-lg font-semibold text-text" }, "\u5206\u7C7B\u7B97\u6CD5\u5165\u95E8")),
                        react_1.default.createElement("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm" },
                            react_1.default.createElement("div", { className: "text-text mb-4" },
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u4EC0\u4E48\u662F\u5206\u7C7B\uFF1F")),
                                react_1.default.createElement("p", { className: "mb-3" }, "\u5206\u7C7B\u7528\u4E8E\u9884\u6D4B\u79BB\u6563\u6807\u7B7E\uFF0C\u5982\"\u662F/\u5426\"\u3001\"\u7C7B\u522BA/B/C\"\u7B49\u3002"),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u5E38\u7528\u5206\u7C7B\u7B97\u6CD5\uFF1A")),
                                react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u903B\u8F91\u56DE\u5F52"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u867D\u7136\u540D\u5B57\u53EB\u56DE\u5F52\uFF0C\u4F46\u5B9E\u9645\u7528\u4E8E\u5206\u7C7B\uFF0C\u7279\u522B\u662F\u4E8C\u5206\u7C7B\u95EE\u9898\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "K-\u8FD1\u90BB(KNN)"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u57FA\u4E8E\u76F8\u4F3C\u5EA6\u7684\u7B80\u5355\u7B97\u6CD5\uFF0C\u4E0D\u9700\u8981\u8BAD\u7EC3\u8FC7\u7A0B\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u51B3\u7B56\u6811"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u6811\u5F62\u7ED3\u6784\uFF0C\u76F4\u89C2\u6613\u7406\u89E3\uFF0C\u53EF\u5904\u7406\u5206\u7C7B\u548C\u56DE\u5F52\u4EFB\u52A1\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u968F\u673A\u68EE\u6797"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u96C6\u6210\u591A\u4E2A\u51B3\u7B56\u6811\uFF0C\u6027\u80FD\u66F4\u7A33\u5B9A\uFF0C\u9632\u6B62\u8FC7\u62DF\u5408\u3002"))),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u8BC4\u4F30\u6307\u6807\uFF1A")),
                                react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2" },
                                    react_1.default.createElement("li", null, "\u51C6\u786E\u7387(Accuracy)"),
                                    react_1.default.createElement("li", null, "\u7CBE\u786E\u7387(Precision)\u548C\u53EC\u56DE\u7387(Recall)"),
                                    react_1.default.createElement("li", null, "F1\u5206\u6570(F1-Score)"),
                                    react_1.default.createElement("li", null, "ROC-AUC\u66F2\u7EBF"))))),
                    react_1.default.createElement("div", { className: "mb-8" },
                        react_1.default.createElement("div", { className: "flex items-center mb-4" },
                            react_1.default.createElement("div", { className: "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3" }, "4"),
                            react_1.default.createElement("h3", { className: "text-lg font-semibold text-text" }, "\u6A21\u578B\u4F18\u5316\u65B9\u6CD5")),
                        react_1.default.createElement("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm" },
                            react_1.default.createElement("div", { className: "text-text mb-4" },
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u8FC7\u62DF\u5408\u548C\u6B20\u62DF\u5408\uFF1A")),
                                react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2 mb-4" },
                                    react_1.default.createElement("li", null, "\u8FC7\u62DF\u5408\uFF1A\u5728\u8BAD\u7EC3\u96C6\u8868\u73B0\u597D\uFF0C\u5728\u6D4B\u8BD5\u96C6\u8868\u73B0\u5DEE"),
                                    react_1.default.createElement("li", null, "\u6B20\u62DF\u5408\uFF1A\u8BAD\u7EC3\u96C6\u548C\u6D4B\u8BD5\u96C6\u8868\u73B0\u90FD\u4E0D\u597D")),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u9632\u6B62\u8FC7\u62DF\u5408\u7684\u65B9\u6CD5\uFF1A")),
                                react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u589E\u52A0\u6570\u636E"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u66F4\u591A\u6570\u636E\u80FD\u5E2E\u52A9\u6A21\u578B\u5B66\u4E60\u66F4\u901A\u7528\u7684\u89C4\u5F8B\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u7B80\u5316\u6A21\u578B"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u51CF\u5C11\u6A21\u578B\u590D\u6742\u5EA6\uFF0C\u907F\u514D\u8BB0\u4F4F\u566A\u97F3\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u6B63\u5219\u5316"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u52A0\u5165\u60E9\u7F5A\u9879\uFF0C\u7EA6\u675F\u6A21\u578B\u590D\u6742\u5EA6\u3002")),
                                    react_1.default.createElement("div", { className: "bg-gray-50 p-4 rounded-lg" },
                                        react_1.default.createElement("h4", { className: "font-medium text-text mb-2" }, "\u96C6\u6210\u5B66\u4E60"),
                                        react_1.default.createElement("p", { className: "text-sm text-text" }, "\u7ED3\u5408\u591A\u4E2A\u6A21\u578B\u7684\u9884\u6D4B\u7ED3\u679C\uFF0C\u63D0\u9AD8\u7A33\u5B9A\u6027\u3002"))),
                                react_1.default.createElement("p", { className: "mb-3" },
                                    react_1.default.createElement("strong", null, "\u4EA4\u53C9\u9A8C\u8BC1\uFF1A")),
                                react_1.default.createElement("ul", { className: "list-disc pl-6 space-y-2" },
                                    react_1.default.createElement("li", null, "\u5C06\u6570\u636E\u5206\u6210\u591A\u4E2A\u90E8\u5206"),
                                    react_1.default.createElement("li", null, "\u8F6E\u6D41\u7528\u4E00\u90E8\u5206\u505A\u6D4B\u8BD5\uFF0C\u5176\u4F59\u505A\u8BAD\u7EC3"),
                                    react_1.default.createElement("li", null, "\u66F4\u7A33\u5065\u7684\u6A21\u578B\u8BC4\u4F30\u65B9\u6CD5")))))),
                react_1.default.createElement("div", { className: "mb-10" },
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-6 text-primary" }, "\u4EA4\u4E92\u5F0FPython\u7EC3\u4E60"),
                    react_1.default.createElement("p", { className: "text-text mb-4" }, "\u5728\u8FD9\u91CC\u5C1D\u8BD5\u7B80\u5355\u7684Python\u4EE3\u7801\uFF0C\u719F\u6089\u57FA\u7840\u8BA1\u7B97\uFF01"),
                    react_1.default.createElement("div", { className: "mb-6" },
                        react_1.default.createElement(react_ace_1.default, { mode: "python", theme: "monokai", value: code, onChange: handleCodeChange, name: "machine-learning-editor", editorProps: {
                                $blockScrolling: true
                            }, placeholder: defaultCode, className: "rounded-lg shadow-sm", style: { height: '300px', width: '100%' } })),
                    react_1.default.createElement("div", { className: "mb-6" },
                        react_1.default.createElement("button", { onClick: handleRunCode, className: "bg-primary text-white py-3 px-8 rounded-full font-bold hover:bg-secondary transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5" }, "\u8FD0\u884C\u4EE3\u7801")),
                    react_1.default.createElement("div", { className: "bg-gray-800 text-white p-4 rounded-lg" }, !result ? (react_1.default.createElement("div", { className: "text-gray-400" }, "\u8FD0\u884C\u7ED3\u679C\u5C06\u663E\u793A\u5728\u8FD9\u91CC")) : result.success ? (react_1.default.createElement("div", { className: "space-y-3" },
                        result.stdout && (react_1.default.createElement("div", null,
                            react_1.default.createElement("h3", { className: "text-green-400 font-semibold mb-1" }, "\u6807\u51C6\u8F93\u51FA:"),
                            react_1.default.createElement("pre", { className: "text-gray-100 whitespace-pre-wrap" }, result.stdout))),
                        result.stderr && (react_1.default.createElement("div", null,
                            react_1.default.createElement("h3", { className: "text-yellow-400 font-semibold mb-1" }, "\u6807\u51C6\u9519\u8BEF:"),
                            react_1.default.createElement("pre", { className: "text-gray-100 whitespace-pre-wrap" }, result.stderr))),
                        !result.stdout && !result.stderr && (react_1.default.createElement("div", { className: "text-green-400" }, "\u4EE3\u7801\u6267\u884C\u6210\u529F\uFF01")))) : (react_1.default.createElement("div", { className: "space-y-3" },
                        result.stdout && (react_1.default.createElement("div", null,
                            react_1.default.createElement("h3", { className: "text-green-400 font-semibold mb-1" }, "\u6807\u51C6\u8F93\u51FA:"),
                            react_1.default.createElement("pre", { className: "text-gray-100 whitespace-pre-wrap" }, result.stdout))),
                        result.stderr && (react_1.default.createElement("div", null,
                            react_1.default.createElement("h3", { className: "text-yellow-400 font-semibold mb-1" }, "\u6807\u51C6\u9519\u8BEF:"),
                            react_1.default.createElement("pre", { className: "text-gray-100 whitespace-pre-wrap" }, result.stderr))),
                        result.error && (react_1.default.createElement("div", { className: "text-red-400" },
                            react_1.default.createElement("h3", { className: "font-semibold mb-1" }, "\u9519\u8BEF\u4FE1\u606F:"),
                            react_1.default.createElement("pre", { className: "whitespace-pre-wrap" },
                                "\u7C7B\u578B: ",
                                result.error.type,
                                "\u6D88\u606F: ",
                                result.error.message,
                                result.error.lineNumber !== undefined && "\n\u884C\u53F7: ".concat(result.error.lineNumber),
                                result.error.stack && "\n\n\u5806\u6808\u8DDF\u8E2A:\n".concat(result.error.stack)))))))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4 text-primary" }, "\u8BFE\u540E\u7EC3\u4E60"),
                    react_1.default.createElement("div", { className: "bg-purple rounded-xl p-6" },
                        react_1.default.createElement("p", { className: "text-text mb-4" }, "\u601D\u8003\u4EE5\u4E0B\u95EE\u9898\uFF1A"),
                        react_1.default.createElement("div", { className: "space-y-3" },
                            react_1.default.createElement("div", { className: "bg-gray-100 p-4 rounded-lg" },
                                react_1.default.createElement("p", { className: "font-medium mb-2" }, "1. \u5047\u8BBE\u4F60\u8981\u9884\u6D4B\u623F\u4EF7\uFF0C\u4F60\u4F1A\u6536\u96C6\u54EA\u4E9B\u7279\u5F81\uFF1F\u4E3A\u4EC0\u4E48\uFF1F")),
                            react_1.default.createElement("div", { className: "bg-gray-100 p-4 rounded-lg" },
                                react_1.default.createElement("p", { className: "font-medium mb-2" }, "2. \u5982\u679C\u4F60\u8981\u8BC6\u522B\u5783\u573E\u90AE\u4EF6\uFF0C\u8FD9\u662F\u56DE\u5F52\u95EE\u9898\u8FD8\u662F\u5206\u7C7B\u95EE\u9898\uFF1F\u4E3A\u4EC0\u4E48\uFF1F")),
                            react_1.default.createElement("div", { className: "bg-gray-100 p-4 rounded-lg" },
                                react_1.default.createElement("p", { className: "font-medium mb-2" }, "3. \u5982\u679C\u4F60\u8981\u5206\u6790\u7528\u6237\u8BC4\u8BBA\u662F\u6B63\u9762\u8FD8\u662F\u8D1F\u9762\uFF0C\u8FD9\u662F\u4E00\u4E2A\u4EC0\u4E48\u7C7B\u578B\u7684\u673A\u5668\u5B66\u4E60\u4EFB\u52A1\uFF1F")))))))));
};
exports.default = MachineLearning;
