import { getChatCompletions } from './openai';
import { OpenAI } from "openai";

async function getSummary(openai: OpenAI, article: any): Promise<string> {
    const prompt = `Please provide an executive summary of the key practical insights and recommendations from this content. 
    Focus on extracting 3-5 of the most important concrete takeaways that are formatted as clear, actionable suggestions the reader can implement based on the information. 
    Avoid filler words and aim for each recommendation to be stand-alone usable if the reader only reads the summary. 
    The goal is to summarize the content's key points in a way that enables the reader to immediately apply them without requiring additional context.
    ---
    Title: ${article.title}
    Text: ${article.textContent}
    ---
        `;
    const model = 'gpt-3.5-turbo-16k'; // or any other model you want to use
    const promptMessages = [{role: 'user', content: prompt}];
    const summary = await getChatCompletions(openai, model, promptMessages);
    return summary;
}


async function createFinalPodcast(openai: OpenAI, summaries: any[]): Promise<string> {
    let summariesString = summaries.join('\n');

    const prompt = `Make these article/video summaries into a daily podcast in the style of the Daily Show.\n\nSummaries:\n${summariesString}\n\n---\n\n`;

    const promptMessages = [{role: 'user', content: prompt}];
    const finalPodcast = await getChatCompletions(openai, 'gpt-3-turbo-16k', promptMessages);
    return finalPodcast;
}


export { getSummary, createFinalPodcast };

