import { supabase } from "./supabase";

/**
 * Translate Indonesian text to English.
 * Tries Supabase edge function first, then falls back to MyMemory API.
 */
export async function translateToEnglish(texts) {
  if (!texts.length) return [];

  // Attempt 1: Supabase edge function
  if (supabase) {
    try {
      const res = await supabase.functions.invoke("translate", {
        body: { texts, from: "id", to: "en" },
      });
      if (!res.error && res.data?.translations?.length === texts.length) {
        return res.data.translations;
      }
    } catch {
      // Fall through to next method
    }
  }

  // Attempt 2: MyMemory Translation API (free, no key, good quality)
  try {
    const results = await Promise.all(
      texts.map(async (text) => {
        const params = new URLSearchParams({
          q: text,
          langpair: "id|en",
          de: "treelogy@support.com",
        });
        const res = await fetch(
          `https://api.mymemory.translated.net/get?${params}`
        );
        if (!res.ok) throw new Error("MyMemory request failed");
        const data = await res.json();
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          let translated = data.responseData.translatedText;
          // MyMemory sometimes returns ALL CAPS for short texts — fix casing
          if (translated === translated.toUpperCase() && translated.length > 3) {
            translated =
              translated.charAt(0) + translated.slice(1).toLowerCase();
          }
          return translated;
        }
        throw new Error("No translation in response");
      })
    );
    return results;
  } catch {
    // Fall through to next method
  }

  // Attempt 3: Google Translate free endpoint
  try {
    const results = await Promise.all(
      texts.map(async (text) => {
        const params = new URLSearchParams({
          client: "gtx",
          sl: "id",
          tl: "en",
          dt: "t",
          q: text,
        });
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?${params}`
        );
        if (!res.ok) throw new Error("Google Translate request failed");
        const data = await res.json();
        // Response is nested arrays: [[["translated","original",...],...],...]
        if (Array.isArray(data) && Array.isArray(data[0])) {
          return data[0].map((seg) => seg[0]).join("");
        }
        throw new Error("Unexpected response format");
      })
    );
    return results;
  } catch {
    // All methods failed — return original texts
    return texts;
  }
}
