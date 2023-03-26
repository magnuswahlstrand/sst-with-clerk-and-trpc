// @filename: server.ts
import {inferAsyncReturnType, initTRPC} from '@trpc/server';
import {awsLambdaRequestHandler, CreateAWSLambdaContextOptions} from '@trpc/server/adapters/aws-lambda';
import {APIGatewayProxyEventV2} from "aws-lambda";


// export type definition of API
export type AppRouter = typeof appRouter;

// created for each request
const createContext = ({
                           event,
                           context,
                       }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
    const headers = event.headers
    return {headers}
}

type Context = inferAsyncReturnType<typeof createContext>;


export const t = initTRPC.context<Context>().create();
const appRouter = t.router({
    getPublicData: t.procedure
        .query(async (req) => {
            return "This is not a secret" + JSON.stringify(req.ctx.headers?.authorization)
        }),
    getPrivateData: t.procedure
        .query(async (req) => {
            return "This is a secret"
        }),
});

export const handler = awsLambdaRequestHandler({
    router: appRouter,
    createContext
})
