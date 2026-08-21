// Text-to-speech using browser Web Speech API SpeechSynthesis
// No API key required. Works in Chrome, Edge, Safari.

export function speakText(text: string, lang: 'en-IN' | 'hi-IN' = 'en-IN'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text
  let cleanedText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/[#*>]/g, '');

  if (cleanedText.length > 300) {
    cleanedText = cleanedText.substring(0, 297) + '...';
  }

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = lang;
  
  // Try to find a voice that matches the lang
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.includes(lang) || v.lang.includes(lang.replace('-', '_')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
