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
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Provider from '../../Provider/Provider';
import { Cell } from './Cell';
import { TableDialog } from '@/entities/node-data';
import { useGetNodeData } from '@/entities/node-data';
import { useDialog } from '@/shared/hooks';
export var DialogData = function (_a) {
    var id = _a.id, open = _a.open, handleClose = _a.handleClose, dialogName = _a.dialogName, currentNodeType = _a.currentNodeType;
    var t = useTranslation('nodes').t;
    var _b = useGetNodeData(id), items = _b.items, isLoading = _b.isLoading;
    var _c = useState(10), pageSize = _c[0], setPageSize = _c[1];
    var _d = useState(0), page = _d[0], setPage = _d[1];
    var _e = useDialog(), isOpen = _e.isOpen, handleDialogOpen = _e.handleDialogOpen, handleDialogClose = _e.handleDialogClose;
    var isAdmin = localStorage.getItem('isAdmin');
    var exportJsonToExcel = function (jsonData_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([jsonData_1], args_1, true), void 0, function (jsonData, filename) {
            var workbook, worksheet, headerRow, buffer, blob;
            if (filename === void 0) { filename = 'data.xlsx'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new ExcelJS.Workbook();
                        worksheet = workbook.addWorksheet('Sheet1');
                        // Определяем колонки
                        worksheet.columns = [
                            { header: t('excel.protectionName'), key: 'protectionName', width: 40 },
                            { header: t('excel.excerpt'), key: 'excerpt', width: 40 },
                            { header: t('excel.source'), key: 'source', width: 40 },
                            {
                                header: t('excel.triggeringConditions'),
                                key: 'triggeringConditions',
                                width: 60
                            },
                            {
                                header: t('excel.triggeringAlgorithm'),
                                key: 'triggeringAlgorithm',
                                width: 70
                            }
                        ];
                        // Добавляем данные
                        jsonData.forEach(function (item) {
                            worksheet.addRow({
                                protectionName: item.protectionName,
                                excerpt: item.excerpt,
                                source: item.source,
                                triggeringConditions: item.triggeringConditions,
                                triggeringAlgorithm: item.triggeringAlgorithm
                            });
                        });
                        headerRow = worksheet.getRow(1);
                        headerRow.eachCell(function (cell) {
                            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // белый цвет текста
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FF4472C4' } // синий фон
                            };
                            cell.alignment = {
                                horizontal: 'center',
                                vertical: 'middle',
                                wrapText: true
                            };
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                        });
                        // Для всех остальных ячеек - перенос строк и выравнивание по левому краю
                        worksheet.eachRow(function (row, rowNumber) {
                            if (rowNumber !== 1) {
                                row.eachCell(function (cell) {
                                    cell.alignment = {
                                        horizontal: 'left', // по левому краю
                                        vertical: 'top',
                                        wrapText: true
                                    };
                                    cell.border = {
                                        top: { style: 'thin' },
                                        left: { style: 'thin' },
                                        bottom: { style: 'thin' },
                                        right: { style: 'thin' }
                                    };
                                });
                            }
                        });
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 1:
                        buffer = _a.sent();
                        blob = new Blob([buffer], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        saveAs(blob, filename);
                        return [2 /*return*/];
                }
            });
        });
    };
    var columns = useMemo(function () { return [
        {
            field: 'protectionName',
            headerName: t('fields.protectionName'),
            flex: 0,
            minWidth: 200,
            maxWidth: 350,
            renderCell: function (params) { return (_jsx(Box, { width: '100%', height: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', sx: {
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                }, children: params.value })); }
        },
        {
            field: 'excerpt',
            headerName: t('fields.excerpt'),
            flex: 0,
            minWidth: 150,
            maxWidth: 200,
            renderCell: function (params) { return (_jsx(Box, { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', sx: {
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                }, children: params.value })); }
        },
        {
            field: 'source',
            headerName: t('fields.source'),
            flex: 0,
            minWidth: 150,
            maxWidth: 350,
            renderCell: function (params) { return (_jsx(Box, { width: '100%', height: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', sx: {
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                }, children: params.value })); }
        },
        {
            field: 'triggeringConditions',
            headerName: t('fields.triggeringConditions'),
            flex: 0,
            minWidth: 250,
            maxWidth: 450,
            renderCell: function (params) { return (_jsx(Box, { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left', sx: {
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                }, children: params.value })); }
        },
        {
            field: 'triggeringAlgorithm',
            headerName: t('fields.triggeringAlgorithm'),
            flex: 1,
            minWidth: 150,
            renderCell: function (params) { return (_jsx(Box, { width: '100%', height: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', sx: {
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                }, children: params.value })); }
        }
    ]; }, [id, handleDialogClose, t]);
    var handlePaginationModelChange = function (paginationModel) {
        setPage(paginationModel.page);
        setPageSize(paginationModel.pageSize);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Dialog, { open: open, onClose: handleClose, "aria-labelledby": 'alert-dialog-title', "aria-describedby": 'alert-dialog-description', fullScreen: true, PaperProps: {
                    sx: {
                        backgroundColor: '#e6f0ff' // светло-серый фон
                    }
                }, children: [_jsxs(DialogTitle, { style: { textAlign: 'center', width: '100%' }, sx: {
                            backgroundColor: '#0073e6', // темно-синий
                            color: '#fff'
                        }, children: [_jsx(Typography, { sx: { fontSize: '2.125rem' }, children: dialogName }), _jsx(IconButton, { "aria-label": 'close', onClick: handleClose, sx: {
                                    position: 'absolute',
                                    right: 8,
                                    top: 8
                                }, children: _jsx(CloseIcon, {}) })] }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, height: '100%', children: [_jsx(Grid, { item: true, xs: 6, children: _jsx(Provider, { currentNodeType: currentNodeType, id: id }) }), _jsxs(Grid, { item: true, xs: 6, sx: { display: 'flex', flexDirection: 'column' }, children: [_jsx("div", { style: {
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                marginBottom: '8px'
                                            } }), _jsxs(Box, { sx: {
                                                textAlign: 'center',
                                                mb: 2
                                            }, children: [_jsx(Typography, { sx: { fontSize: '2.125rem' }, children: t('tableTitle') }), _jsxs(Box, { sx: {
                                                        mt: 2,
                                                        display: 'flex',
                                                        justifyContent: 'right',
                                                        gap: '1rem',
                                                        flexWrap: 'wrap'
                                                    }, children: [isAdmin === 'true' && (_jsx(Button, { onClick: handleDialogOpen, variant: 'contained', startIcon: _jsx(AddIcon, {}), children: t('actions.add') })), _jsx(Button, { onClick: function () {
                                                                return exportJsonToExcel(items, t('excel.fileName'));
                                                            }, variant: 'contained', startIcon: _jsx(FileDownloadIcon, {}), children: t('actions.saveToExcel') })] })] }), _jsx(DataGrid, { disableRowSelectionOnClick: true, loading: isLoading, autoHeight: true, rows: items, columns: isAdmin === 'true'
                                                ? __spreadArray([
                                                    {
                                                        field: 'deleteEdit',
                                                        headerName: '',
                                                        minWidth: 100,
                                                        maxWidth: 100,
                                                        renderCell: function (_a) {
                                                            var row = _a.row;
                                                            return (_jsx(Cell, { items: items, nodeId: id, row: row }));
                                                        }
                                                    }
                                                ], columns, true) : columns, paginationModel: { page: page, pageSize: pageSize }, onPaginationModelChange: handlePaginationModelChange, pageSizeOptions: [5, 10, 15, 20], localeText: ruRU.components.MuiDataGrid.defaultProps.localeText, getRowHeight: function () { return 'auto'; }, sx: {
                                                '& .MuiDataGrid-row:nth-of-type(odd)': {
                                                    backgroundColor: '#e6f0ff' // светло-зелёный
                                                }
                                            } })] })] }) })] }), _jsx(TableDialog, { items: items, nodeId: id, open: isOpen, handleClose: handleDialogClose })] }));
};
