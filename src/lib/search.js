import Fuse from "fuse.js";

const FUSE_OPTIONS = {
  keys: [
    { name: "question", weight: 3 },
    { name: "answer", weight: 1 },
    { name: "categoryName", weight: 0.5 },
  ],
  threshold: 0.35, // 0 = exact, 1 = match anything — 0.35 handles typos well
  distance: 300,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true, // search the entire string, not just the beginning
};

export function buildIndex(articles, categories, lang) {
  return articles.map((a) => {
    const q = a.question[lang] || a.question.id;
    const ans = a.answer[lang] || a.answer.id;
    const cat = categories.find((c) => c.id === a.categoryId);
    return {
      id: a.id,
      categoryId: a.categoryId,
      categoryName: cat ? cat.name[lang] || cat.name.id : "",
      question: q,
      answer: ans,
      qLower: q.toLowerCase(),
      searchText: q.toLowerCase() + " " + ans.toLowerCase(),
      article: a,
    };
  });
}

export function smartSearch(index, query, limit = 20) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const fuse = new Fuse(index, FUSE_OPTIONS);
  const results = fuse.search(trimmed, { limit });

  // Return in the same shape, with score (higher = better match)
  return results.map((r) => ({
    ...r.item,
    score: Math.round((1 - (r.score || 0)) * 100),
  }));
}
