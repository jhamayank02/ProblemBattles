import { marked } from "marked";

export const markdownToHtml = async (markdown: string): Promise<string> => {
    return await marked(markdown, {
        breaks: true,
        gfm: true
    });
}