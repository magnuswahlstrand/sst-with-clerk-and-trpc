// utils/trpc.ts
import {createTRPCProxyClient, createTRPCReact, httpBatchLink} from '@trpc/react-query';
import type {AppRouter} from '../../../packages/functions/src/server';


export const trpcUrl = "https://0ejomr8zs2.execute-api.eu-west-1.amazonaws.com/api"

export const trpc = createTRPCReact<AppRouter>();
export const trpc2Vanilla = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({url: trpcUrl,}),
    ],
});