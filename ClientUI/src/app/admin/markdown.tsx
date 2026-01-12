import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown = ({markdown}: {markdown: string}) => {
    return (
        <div className="markdown-preview">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                    code: ({ node, className, ...props }) => {
                        const isInline = !className?.includes('language-');
                        return isInline ?
                            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600" {...props} /> :
                            <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />;
                    },
                    pre: ({ node, ...props }) => <pre className="my-4" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-8 border-gray-300" {...props} />,
                    table: ({ node, ...props }) => <table className="border-collapse border border-gray-300 w-full my-4" {...props} />,
                    th: ({ node, ...props }) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left" {...props} />,
                    td: ({ node, ...props }) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                }}
            >
                {markdown}
            </ReactMarkdown>
        </div>
    )
}

export default Markdown