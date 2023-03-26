import {trpc2Vanilla} from "./utils/trpc";
import {ReactSketchCanvas, ReactSketchCanvasRef} from "react-sketch-canvas";
import {MutableRefObject, useRef, useState} from "react";
import ResultImage from "./components/ResultImage";

function dataURItoBlob(dataURI: string) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
}

async function uploadImage(imageDataUrl: Promise<string>, prompt: string) {
    const upload = await trpc2Vanilla.getUploadUrl.query(prompt)

    const previewUrl = await imageDataUrl
    const blob = dataURItoBlob(previewUrl)

    const body = new FormData();
    Object.entries(upload.fields).map(([key, value]) =>
        body.append(key, value),
    );
    body.append("file", blob);
    console.log("id", upload.id)
    const response = await fetch(upload.url, {
        method: "POST",
        body,
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
    }
    return {previewUrl: previewUrl, id: upload.id, prompt}
}


type imageData = {
    id: string,
    previewUrl: string,
    prompt: string
}

export default function Home() {
    const [sending, setSending] = useState<boolean>(false);
    const [imageIds, setImageIds] = useState<imageData[]>([
        {id: "1", previewUrl: "https://i.imgur.com/1ZQ2Z1K.png", prompt: "a goofy owl"},
        {id: "2", previewUrl: "https://i.imgur.com/1ZQ2Z1K.png", prompt: "a goofier owl"},
    ]);
    const [aiPrompt, setPrompt] = useState<string>("a cool cat");

    const canvasRef: MutableRefObject<ReactSketchCanvasRef> | undefined = useRef<ReactSketchCanvasRef>(null!);

    const onSend = (e: any) => {
        if (!canvasRef?.current) return;

        const dataUrl = canvasRef.current.exportImage("png")
        setSending(true)
        uploadImage(dataUrl, aiPrompt).then((imgDetails) => {
            setSending(false)
            setImageIds((prevIds) => [imgDetails, ...prevIds])
            canvasRef.current.clearCanvas()
            setPrompt("")
        }).catch(error => {
            console.log("error", error)
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full md:w-2/3 lg:w-1/2 mx-auto flex flex-col items-center">
                <h1 className={"text-5xl font-bold"}>Cool Diffusion</h1>
                <ReactSketchCanvas
                    ref={canvasRef}
                    width="200"
                    height="200"
                    strokeWidth={4}
                    strokeColor="black"
                    className={"w-96 h-96"}
                />
                <div className={"pb-2"}>
                    <label htmlFor="first_name"
                           className="block mb-2 text-sm font-medium text-gray-900">Image prompt</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        type={"text"} value={aiPrompt} onChange={(e) => setPrompt(e.target.value)}
                        placeholder={"Enter a prompt to display an image"}/>
                </div>

                <div className="flex flex-row">
                    <button
                        disabled={sending}
                        onClick={() => canvasRef?.current.clearCanvas()}
                        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  disabled:bg-slate-50">
                        Clear
                    </button>
                    <button
                        disabled={sending}
                        onClick={onSend}
                        className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  disabled:bg-slate-50">
                        Submit image
                    </button>
                </div>
            </div>

            {imageIds.map((image) =>
                <ResultImage id={image.id} key={image.id} previewUrl={image.previewUrl} prompt={image.prompt}/>
            )}

            <div className={"text-sm pt-6"} onClick={() => {
                navigator.clipboard.writeText("hej")
            }}>
                <ul>
                    <li className={"pt-1"}>Inspired by <a
                        href={"https://scribblediffusion.com/"}>scribblediffusion.com</a></li>
                    <li className={"pt-1"}>Built by <a href="https://github.com/magnuswahlstrand">Magnus Wahlstrand</a>
                    </li>
                    <li className={"pt-1"}>Using <a href="https://sst.dev">sst.dev</a> and <a
                        href="https://github.com/replicate/scribble-diffusion">replicate/scribble-diffusion</a></li>
                </ul>
            </div>
        </div>
    )
}