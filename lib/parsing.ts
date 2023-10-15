// parsing.ts
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function parseArticle(url: string) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article;
}