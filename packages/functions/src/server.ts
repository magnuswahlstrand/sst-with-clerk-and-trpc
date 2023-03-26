// @filename: server.ts
import {initTRPC} from '@trpc/server';
import {awsLambdaRequestHandler} from '@trpc/server/adapters/aws-lambda';
import KSUID from "ksuid";

import {z} from 'zod';
import {checkExists, generatePresignedUrlAndFormFields, generateSignedUrlGet} from "./s3";
import {Bucket} from "sst/node/bucket";

export const t = initTRPC.create();
const appRouter = t.router({
        getUploadUrl: t.procedure
            .input(z.string())
            .query((req) => {
                const id = KSUID.randomSync().string;
                const prompt = req.input;
                return generatePresignedUrlAndFormFields(id, prompt);
            }),
        getImage: t.procedure
            .input(z.string())
            .query(async (req) => {
                const imgId = req.input;
                const filename = imgId + ".png"

                await checkExists(Bucket.output.bucketName, filename);
                return {
                    input: await generateSignedUrlGet(Bucket.input.bucketName, filename),
                    output: await generateSignedUrlGet(Bucket.output.bucketName, filename),
                };
            }),
    })
;
// export type definition of API
export type AppRouter = typeof appRouter;

export const handler = awsLambdaRequestHandler({router: appRouter})