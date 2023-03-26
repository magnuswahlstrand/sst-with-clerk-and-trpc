import {trpc} from "../utils/trpc";

const SpinnerLoader = () => {
    return <div className={"flex flex-row justify-center h-full"}>
        <div className="flex flex-row items-center">
            <div>
                Processing
            </div>
            <svg className="h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                <circle cx="4" cy="12" r="3">
                    <animate id="spinner_jObz" begin="0;spinner_vwSQ.end-0.25s" attributeName="r" dur="0.75s"
                             values="3;.2;3"/>
                </circle>
                <circle cx="12" cy="12" r="3">
                    <animate begin="spinner_jObz.end-0.6s" attributeName="r" dur="0.75s" values="3;.2;3"/>
                </circle>
                <circle cx="20" cy="12" r="3">
                    <animate id="spinner_vwSQ" begin="spinner_jObz.end-0.45s" attributeName="r" dur="0.75s"
                             values="3;.2;3"/>
                </circle>
            </svg>
        </div>
    </div>
}

const ResultImage = (props: { id: string, previewUrl: string, prompt: string }) => {
    const img = trpc.getImage.useQuery(props.id, {retry: 30});

    if (img.error) return <div>Error: {img.error.message}</div>;


    const outputImage = img.data ? (
        <img
            alt="output image"
            src={img.data.output}
            className="w-80 h-80"
        />
    ) : (
        <div className="w-80 h-80">
            <SpinnerLoader/>
        </div>
    );

    return (
        <div className={"mb-10"}>
            <div className={"flex flex-row justify-center rounded-xl bg-white shadow-lg"}>
                <img alt={"input image"} src={props.previewUrl} className="w-80 h-80"/>
                {outputImage}
            </div>
            <div className={"text-slate-500 text-xl cap mt-2"}>"{props.prompt}"</div>
        </div>
    );
}

export default ResultImage;