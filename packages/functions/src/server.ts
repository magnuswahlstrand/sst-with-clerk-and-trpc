// @filename: server.ts
import {initTRPC} from '@trpc/server';
import {awsLambdaRequestHandler} from '@trpc/server/adapters/aws-lambda';

export const t = initTRPC.create();
const appRouter = t.router({
        getPublicData: t.procedure
            .query(async (req) => {
                return "This is not a secret"
            }),
        getPrivateData: t.procedure
            .query(async (req) => {
                return "This is a secret"
            }),
    })
;
// export type definition of API
export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({router: appRouter})