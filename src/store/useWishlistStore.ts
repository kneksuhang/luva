import { create } from 'zustand';
import { Category, Product, Tag } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_TAGS } from '../lib/constants';
import { supabase } from '../lib/supabase';

interface WishlistState {
  products: Product[];
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  supabaseConnected: boolean;
  supabaseMessage?: string;

  // Sync / Init
  fetchFromSupabase: () => Promise<void>;

  // Products
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  archiveProduct: (id: string, isArchived: boolean) => Promise<void>;

  // Categories
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Tags
  addTag: (tag: Omit<Tag, 'id' | 'created_at'>) => Promise<Tag>;
  updateTag: (id: string, updates: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  // Reset Data (Module 5)
  resetData: (options: { products?: boolean; categories?: boolean; tags?: boolean }) => Promise<void>;

  // Import Data
  importData: (data: { products?: Product[]; categories?: Category[]; tags?: Tag[] }) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  // In-memory initial data (Strictly NO localStorage per instruction)
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  tags: INITIAL_TAGS,
  isLoading: false,
  supabaseConnected: false,
  supabaseMessage: undefined,

  fetchFromSupabase: async () => {
    set({ isLoading: true });
    try {
      // Check Categories
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      // Check Tags
      const { data: tagData, error: tagError } = await supabase.from('tags').select('*');
      // Check Products
      const { data: prodData, error: prodError } = await supabase.from('products').select('*');

      if (!catError && !tagError && !prodError) {
        set({
          categories: catData || [],
          tags: tagData || [],
          products: prodData || [],
          supabaseConnected: true,
          supabaseMessage: 'Terkoneksi dengan Supabase secara langsung.',
          isLoading: false,
        });
      } else {
        set({
          supabaseConnected: false,
          supabaseMessage: 'Supabase siap digunakan.',
          isLoading: false,
        });
      }
    } catch {
      set({
        supabaseConnected: false,
        supabaseMessage: 'Gagal menghubungi Supabase. Berjalan dalam memori aman.',
        isLoading: false,
      });
    }
  },

  addProduct: async (productData) => {
    const now = new Date().toISOString();
    const newId = `prod-${Date.now()}`;
    const categoryName = get().categories.find((c) => c.id === productData.category_id)?.name;

    const newProduct: Product = {
      ...productData,
      id: newId,
      category_name: categoryName,
      created_at: now,
      updated_at: now,
    };

    // Update in-memory state
    set((state) => ({
      products: [newProduct, ...state.products],
    }));

    // Async write to Supabase if connected
    try {
      await supabase.from('products').insert([
        {
          id: newProduct.id,
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          image_url: newProduct.image_url,
          category_id: newProduct.category_id,
          tags: newProduct.tags,
          links: newProduct.links,
          is_archived: newProduct.is_archived,
          priority: newProduct.priority,
          created_at: newProduct.created_at,
          updated_at: newProduct.updated_at,
        },
      ]);
    } catch {
      // Ignored for graceful fallback
    }

    return newProduct;
  },

  updateProduct: async (id, updates) => {
    const now = new Date().toISOString();
    let categoryName: string | undefined;

    if (updates.category_id) {
      categoryName = get().categories.find((c) => c.id === updates.category_id)?.name;
    }

    set((state) => ({
      products: state.products.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              ...(categoryName ? { category_name: categoryName } : {}),
              updated_at: now,
            }
          : item
      ),
    }));

    // Async write to Supabase
    try {
      await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: now,
        })
        .eq('id', id);
    } catch {
      // Ignored
    }
  },

  deleteProduct: async (id) => {
    set((state) => ({
      products: state.products.filter((item) => item.id !== id),
    }));

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch {
      // Ignored
    }
  },

  archiveProduct: async (id, isArchived) => {
    const now = new Date().toISOString();
    set((state) => ({
      products: state.products.map((item) =>
        item.id === id ? { ...item, is_archived: isArchived, updated_at: now } : item
      ),
    }));

    try {
      await supabase.from('products').update({ is_archived: isArchived, updated_at: now }).eq('id', id);
    } catch {
      // Ignored
    }
  },

  addCategory: async (catData) => {
    const newId = `cat-${Date.now()}`;
    const newCategory: Category = {
      ...catData,
      id: newId,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      categories: [...state.categories, newCategory],
    }));

    try {
      await supabase.from('categories').insert([newCategory]);
    } catch {
      // Ignored
    }

    return newCategory;
  },

  updateCategory: async (id, updates) => {
    set((state) => ({
      categories: state.categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
      products: state.products.map((p) =>
        p.category_id === id && updates.name ? { ...p, category_name: updates.name } : p
      ),
    }));

    try {
      await supabase.from('categories').update(updates).eq('id', id);
    } catch {
      // Ignored
    }
  },

  deleteCategory: async (id) => {
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      products: state.products.map((p) =>
        p.category_id === id ? { ...p, category_id: null, category_name: undefined } : p
      ),
    }));

    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch {
      // Ignored
    }
  },

  addTag: async (tagData) => {
    const newId = `tag-${Date.now()}`;
    const newTag: Tag = {
      ...tagData,
      id: newId,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      tags: [...state.tags, newTag],
    }));

    try {
      await supabase.from('tags').insert([newTag]);
    } catch {
      // Ignored
    }

    return newTag;
  },

  updateTag: async (id, updates) => {
    const prevTag = get().tags.find((t) => t.id === id);
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      products: updates.name && prevTag
        ? state.products.map((p) => ({
            ...p,
            tags: p.tags.map((t) => (t === prevTag.name ? updates.name! : t)),
          }))
        : state.products,
    }));

    try {
      await supabase.from('tags').update(updates).eq('id', id);
    } catch {
      // Ignored
    }
  },

  deleteTag: async (id) => {
    const tag = get().tags.find((t) => t.id === id);
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
      products: tag
        ? state.products.map((p) => ({
            ...p,
            tags: p.tags.filter((t) => t !== tag.name),
          }))
        : state.products,
    }));

    try {
      await supabase.from('tags').delete().eq('id', id);
    } catch {
      // Ignored
    }
  },

  resetData: async ({ products, categories, tags }) => {
    set((state) => ({
      products: products ? [] : state.products,
      categories: categories ? [] : state.categories,
      tags: tags ? [] : state.tags,
    }));

    try {
      if (products) await supabase.from('products').delete().neq('id', '');
      if (categories) await supabase.from('categories').delete().neq('id', '');
      if (tags) await supabase.from('tags').delete().neq('id', '');
    } catch {
      // Ignored
    }
  },

  importData: async (data) => {
    set((state) => ({
      products: data.products && data.products.length > 0 ? data.products : state.products,
      categories: data.categories && data.categories.length > 0 ? data.categories : state.categories,
      tags: data.tags && data.tags.length > 0 ? data.tags : state.tags,
    }));

    try {
      if (data.categories?.length) {
        await supabase.from('categories').upsert(data.categories);
      }
      if (data.tags?.length) {
        await supabase.from('tags').upsert(data.tags);
      }
      if (data.products?.length) {
        await supabase.from('products').upsert(data.products);
      }
    } catch {
      // Ignored
    }
  },
}));
