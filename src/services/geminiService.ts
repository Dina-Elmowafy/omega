/**
 * Gemini integration removed — frontend-only mode.
 * Original implementation used @google/genai; replaced with a local stub so the frontend works without server AI.
 */
import { ChatMessage } from '../types';

export const sendMessageToGemini = async (
  _history: ChatMessage[],
  _newMessage: string
): Promise<string> => {
  console.warn('sendMessageToGemini: Gemini integration removed. Running in frontend-only mode.');
  return "الميزة المعتمدة على الخادم غير متاحة في هذا الوضع. الرجاء التواصل معنا عبر الموقع أو الهاتف.";
};