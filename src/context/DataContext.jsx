import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  categories as staticCategories,
  articles as staticArticles,
} from "../data/knowledgeBase";

const DataContext = createContext(null);

/* ─── Shape adapters: Supabase row ↔ app shape ─── */

function rowToCategory(r) {
  return {
    id: r.id,
    name: { id: r.name_id, en: r.name_en },
    icon: r.icon,
    description: { id: r.description_id, en: r.description_en },
    sort_order: r.sort_order,
  };
}

function rowToArticle(r) {
  return {
    id: r.id,
    categoryId: r.category_id,
    question: { id: r.question_id, en: r.question_en },
    answer: { id: r.answer_id, en: r.answer_en },
    updated_by: r.updated_by,
    updated_at: r.updated_at,
    created_at: r.created_at,
    // joined user info
    updater_name: r.faq_users?.name || null,
    updater_role: r.faq_users?.role || null,
  };
}

/* ─── Provider ─── */

export function DataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Initial fetch ── */
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Fallback to static data
      setCategories(staticCategories);
      setArticles(staticArticles.map((a) => ({ ...a, updated_at: null, updater_name: null, updater_role: null })));
      setLoading(false);
      return;
    }
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [catRes, artRes, userRes] = await Promise.all([
        supabase.from("faq_categories").select("*").order("sort_order"),
        supabase
          .from("faq_articles")
          .select("*, faq_users(name, role)")
          .order("id"),
        supabase.from("faq_users").select("*").eq("is_active", true).order("name"),
      ]);

      if (catRes.error) throw catRes.error;
      if (artRes.error) throw artRes.error;
      if (userRes.error) throw userRes.error;

      setCategories(catRes.data.map(rowToCategory));
      setArticles(artRes.data.map(rowToArticle));
      setUsers(userRes.data);
    } catch (err) {
      console.error("Failed to load data from Supabase:", err);
      setError(err.message);
      // Fallback
      setCategories(staticCategories);
      setArticles(staticArticles.map((a) => ({ ...a, updated_at: null, updater_name: null, updater_role: null })));
    } finally {
      setLoading(false);
    }
  }

  /* ── CRUD: Update Article ── */
  const updateArticle = useCallback(async (id, updates, userId, userName) => {
    if (!supabase) throw new Error("Supabase not configured");

    const old = articles.find((a) => a.id === id);
    if (!old) throw new Error("Article not found");

    const payload = {
      question_id: updates.question_id,
      question_en: updates.question_en,
      answer_id: updates.answer_id,
      answer_en: updates.answer_en,
      category_id: updates.category_id,
      updated_by: userId,
    };

    const { data, error: err } = await supabase
      .from("faq_articles")
      .update(payload)
      .eq("id", id)
      .select("*, faq_users(name, role)")
      .single();

    if (err) throw err;

    // Build changes diff
    const changes = {};
    if (old.question.id !== updates.question_id) changes.question_id = { from: old.question.id, to: updates.question_id };
    if (old.question.en !== updates.question_en) changes.question_en = { from: old.question.en, to: updates.question_en };
    if (old.answer.id !== updates.answer_id) changes.answer_id = { from: old.answer.id, to: updates.answer_id };
    if (old.answer.en !== updates.answer_en) changes.answer_en = { from: old.answer.en, to: updates.answer_en };
    if (old.categoryId !== updates.category_id) changes.category_id = { from: old.categoryId, to: updates.category_id };

    // Log history
    await supabase.from("faq_history").insert({
      article_id: id,
      action: "update",
      user_id: userId,
      user_name: userName,
      changes,
      article_snapshot: { id, ...updates },
    });

    // Update local state
    const updated = rowToArticle(data);
    setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, [articles]);

  /* ── CRUD: Delete Article ── */
  const deleteArticle = useCallback(async (id, userId, userName) => {
    if (!supabase) throw new Error("Supabase not configured");

    const old = articles.find((a) => a.id === id);
    if (!old) throw new Error("Article not found");

    // Log history BEFORE delete
    await supabase.from("faq_history").insert({
      article_id: id,
      action: "delete",
      user_id: userId,
      user_name: userName,
      changes: {},
      article_snapshot: {
        id: old.id,
        category_id: old.categoryId,
        question_id: old.question.id,
        question_en: old.question.en,
        answer_id: old.answer.id,
        answer_en: old.answer.en,
      },
    });

    const { error: err } = await supabase.from("faq_articles").delete().eq("id", id);
    if (err) throw err;

    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, [articles]);

  /* ── CRUD: Create Article ── */
  const createArticle = useCallback(async (newArticle, userId, userName) => {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error: err } = await supabase
      .from("faq_articles")
      .insert({
        category_id: newArticle.category_id,
        question_id: newArticle.question_id,
        question_en: newArticle.question_en,
        answer_id: newArticle.answer_id,
        answer_en: newArticle.answer_en,
        updated_by: userId,
      })
      .select("*, faq_users(name, role)")
      .single();

    if (err) throw err;

    await supabase.from("faq_history").insert({
      article_id: data.id,
      action: "create",
      user_id: userId,
      user_name: userName,
      changes: {},
      article_snapshot: { id: data.id, ...newArticle },
    });

    const created = rowToArticle(data);
    setArticles((prev) => [...prev, created]);
    return created;
  }, []);

  /* ── Fetch History ── */
  const fetchHistory = useCallback(async (articleId = null) => {
    if (!supabase) return [];
    let query = supabase
      .from("faq_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (articleId) query = query.eq("article_id", articleId);

    const { data, error: err } = await query;
    if (err) throw err;
    return data || [];
  }, []);

  /* ── Helper functions (same interface as knowledgeBase.js) ── */
  const getCategoryById = useCallback(
    (id) => categories.find((c) => c.id === id) || null,
    [categories]
  );

  const getArticlesByCategory = useCallback(
    (categoryId) => articles.filter((a) => a.categoryId === categoryId),
    [articles]
  );

  const value = {
    categories,
    articles,
    users,
    loading,
    error,
    getCategoryById,
    getArticlesByCategory,
    updateArticle,
    deleteArticle,
    createArticle,
    fetchHistory,
    reload: loadAll,
    isConnected: isSupabaseConfigured(),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
