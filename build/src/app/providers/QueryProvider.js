import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
export var QueryProvider = function (_a) {
    var children = _a.children;
    var client = useState(new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    }))[0];
    return _jsx(QueryClientProvider, { client: client, children: children });
};
