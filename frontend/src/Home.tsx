import {ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, UserButton, useUser} from "@clerk/clerk-react";
import {trpc} from "./utils/trpc";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


type imageData = {
    id: string,
    previewUrl: string,
    prompt: string
}

function Hello() {
    const {user} = useUser();


    return <div className="App-header">
        {/* Mount the UserButton component */}
        <UserButton/>
        {user ? <h1>Hello, {user.firstName}!</h1> : null}
    </div>
}


export default function Home() {
    const pub = trpc.getPublicData.useQuery();
    const priv = trpc.getPrivateData.useQuery();

    return (
        <div className="container mx-auto px-4 py-8">
            <ClerkProvider publishableKey={clerkPubKey}>
                <div>
                    <h1>Public Data</h1>
                    <div>{pub.isLoading ? "Loading" : "Not loading"}|{pub.data}</div>
                    <h1>Private Data</h1>
                    <div>{priv.isLoading ? "Loading" : "Not loading"}|{priv.data}</div>
                </div>
                <SignedIn>
                    <Hello/>
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn/>
                </SignedOut>
            </ClerkProvider>
        </div>
    )
}