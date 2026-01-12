import { useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { createSubmissionService } from '@/services/submission.service';
import { tryCatch } from '@/lib/try-catch';
import { toast } from 'sonner';
import { useWebSocket } from '@/websocket/useWebsocket';

export const LanguageOptions = {
    // Javascript: "javascript",
    Cpp: "cpp",
    // Java: "java",
    // Python: "python",
} as const;

export type LanguageOptionsType = typeof LanguageOptions[keyof typeof LanguageOptions];

export const EditorThemeOptions = {
    Vs: "vs",
    VsDark: "vs-dark",
    HcBlack: "hc-black",
} as const;

export type EditorThemeOptionsType = typeof EditorThemeOptions[keyof typeof EditorThemeOptions];

interface CodeEditorProps {
    problemId: string;
    onResult: () => void;
    stub: string;
}

const CodeEditor = ({ problemId, onResult, stub }: CodeEditorProps) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageOptionsType>(LanguageOptions.Cpp);
    const [selectedTheme, setSelectedTheme] = useState<EditorThemeOptionsType>(EditorThemeOptions.Vs);
    const [code, setCode] = useState<string>(stub);
    const [lastSubmissionId, setLastSubmissionId] = useState<string | null>();
    const { connected, message } = useWebSocket(import.meta.env.VITE_APP_BACKEND_WS_URL);

    const submitSolutionHandler = async () => {
        const payload = {
            problemId,
            code,
            language: selectedLanguage
        }
        const [res, error] = await tryCatch(() => createSubmissionService(payload));
        if (error) {
            if (typeof error === 'object' && Array.isArray(error)) {
                toast.error("Oops, An error occurred!", {
                    description: error[0],
                    closeButton: true,
                });
            }
            else {
                toast.error("Oops, An error occurred!", {
                    description: "something went wrong",
                    closeButton: true,
                });
            }
        } else {
            setLastSubmissionId(res?.data?.data?.id);
            toast.error("Running", {
                description: "Executing your code...",
                closeButton: true,
            });
        }
    }

    useEffect(()=>{
        if(message){
            setLastSubmissionId(null);
            onResult();
        }
    }, [message]);

    return (
        <section className='border-gray-200 dark:border-gray-800 rounded-lg border p-2'>
            <div className='mb-1 flex gap-2'>
                <Select defaultValue={selectedLanguage} onValueChange={(val: LanguageOptionsType) => setSelectedLanguage(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.values(LanguageOptions).map((val: string) => <SelectItem value={val} key={val}>{val}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select defaultValue={selectedTheme} onValueChange={(val: EditorThemeOptionsType) => setSelectedTheme(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.values(EditorThemeOptions).map((val: string) => <SelectItem value={val} key={val}>{val}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Editor
                height="75vh"
                defaultLanguage={selectedLanguage}
                defaultValue={code}
                onChange={(val) => val && setCode(val)}
                theme={selectedTheme}
            />
            <div className="p-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center gap-2">
                {connected && <div className='bg-green-400 h-2 w-2 rounded-full'></div>}
                {!connected && <div className='bg-green-400 h-2 w-2 rounded-full'></div>}
                <Button onClick={submitSolutionHandler} disabled={lastSubmissionId ? lastSubmissionId != message?.id : false}>{lastSubmissionId ? 'Running...' : 'Run'}</Button>
            </div>
        </section>
    )
}

export default CodeEditor