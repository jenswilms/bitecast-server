import { OpenAI } from "openai";

export function createOpenAI() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
    return openai;
  }
  
  export async function getChatCompletions(
    openai: OpenAI,
    model: string,
    promptMessages: any[],
    temperature = 0.0,
    maxTokens = 500
  ) {
  
    const response = await openai.chat.completions.create({
      messages: promptMessages,
      temperature: temperature,
      model: model,
    });
  
    const answer = response.choices[0]?.message?.content?.trim() || '';
  
    return answer;
  }