import { SSTConfig } from "sst";
import { API } from "./stacks/AuthStack";

export default {
    config(_input) {
        return {
            name: "sst-with-clerk-and-trpc",
            region: "eu-west-1",
        };
    },
    stacks(app) {
        app.stack(API);
    }
} satisfies SSTConfig;
