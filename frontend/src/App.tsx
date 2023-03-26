import './App.css'
import Home from "./Home";
import {useState} from "react";
import {trpc, trpcUrl} from "./utils/trpc";
import {httpBatchLink} from "@trpc/react-query";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


export default function App() {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({url: trpcUrl}),
            ],
        }),
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <Home/>
            </QueryClientProvider>
        </trpc.Provider>
    );
}