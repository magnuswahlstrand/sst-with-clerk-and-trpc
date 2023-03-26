// utils/trpc.ts
import {createTRPCReact} from '@trpc/react-query';
import type {AppRouter} from '../../../packages/functions/src/server';


export const trpcUrl = "https://1jkmvuinb8.execute-api.eu-west-1.amazonaws.com/api"

export const trpc = createTRPCReact<AppRouter>();
