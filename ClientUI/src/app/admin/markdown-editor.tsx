import { useEffect, useState } from "react";
import Markdown from "./markdown";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

const MarkdownEditor = ({ content, setContent }: { content?: string, setContent: (content: string) => void }) => {
    const [markdown, setMarkdown] = useState(content || "# Start writing your content here...\n\n## Subheading\n\nThis is a **bold** text and this is *italic*.\n\n- List item 1\n- List item 2\n- List item 3\n\n```javascript\nconst greeting = 'Hello World';\nconsole.log(greeting);\n```\n\n> A blockquote example");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        setContent(markdown)
    }, [markdown, setContent]);

    return (
        <div className="flex flex-col gap-4">
            <textarea
                className="w-full h-[300px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your markdown..."
            />
            <Button type="button" variant='outline' onClick={() => setShowPreview(curr => !curr)}>
                Show preview{showPreview ? <EyeIcon /> : <EyeClosedIcon />}
            </Button>

            {/* Markdown Preview with proper styling */}
            {showPreview && <div className="w-full h-[300px] p-4 border border-gray-300 rounded-lg bg-white overflow-auto prose prose-sm max-w-none">
                <Markdown markdown={markdown} />
            </div>}
        </div>
    );
};

export default MarkdownEditor;