import {Api, StackContext} from "sst/constructs";

export function API({stack}: StackContext) {
    // const REPLICATE_API_TOKEN = new Config.Secret(stack, "REPLICATE_API_TOKEN");

    const api = new Api(stack, "api", {
        routes: {
            "GET /api/{proxy+}": "packages/functions/src/server.handler",
        },
        cors: {
            allowMethods: ["GET"],
            allowOrigins: ["*"],
        },
    });

    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}
