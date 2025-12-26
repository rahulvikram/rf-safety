export function Footer() {
    return (
        <footer className="flex flex-col items-center">
            <p className="text-xs text-gray-500 text-center">
            Powered by Roboflow{" "}
                <a
                    href="https://docs.roboflow.com/deploy/sdks/web-browser/web-inference.js"
                    className="underline hover:text-gray-700"
                    style={{ color: "var(--rf-purple)" }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    InferenceJS
                </a>
                .
            </p>
        </footer>
    )
}