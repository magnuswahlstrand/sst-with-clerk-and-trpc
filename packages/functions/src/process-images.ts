import {S3Handler} from "aws-lambda";
import * as console from "console";
import {Config} from "sst/node/config";
import {predict} from "replicate-api";
import {generateSignedUrlGet, getMetadata, uploadFile} from "./s3";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {Bucket} from "sst/node/bucket";


async function sendToReplicateAI(bucket: string, filename: string) {

    const metadata = await getMetadata(bucket, filename)
    console.log("META")
    console.log(metadata.Metadata)

    if (!metadata.Metadata || !metadata.Metadata.prompt) throw new Error("No prompt")
    const prompt = metadata.Metadata.prompt


    const url = await generateSignedUrlGet(bucket, filename)
    const prediction = await predict({
        version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117", // The model name
        input: {
            image: url,
            prompt: prompt,
        },
        token: Config.REPLICATE_API_TOKEN,
        poll: true,
    })


    const downloadUrl = prediction.output[1]; // TODO: how to do?
    const response = await fetch(downloadUrl);
    const fileStream = response.body;

    if (!fileStream) {
        throw new Error('Failed to download the file');
    }


    await uploadFile(({
        Bucket: Bucket.output.bucketName,
        Key: filename,
        Body: fileStream,
    }))

    console.log('Complete!', downloadUrl)
}


export const handler: S3Handler = async (event) => {
    console.log(`Received ${event.Records.length} records`);
    const processingPromises = event.Records.map(async (record) => {
        const bucket = record.s3.bucket.name;
        const filename = record.s3.object.key
        await sendToReplicateAI(bucket, filename);
    });

    await Promise.all(processingPromises);
}
