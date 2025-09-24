import { supabase } from "../config/supabaseClient.js";

export const MedicationModel = {
  async getAll({ name, page = 1, limit = 10 }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from("medications")
      .select(
        "id, sku, name, description, price, quantity, category_id, supplier_id",
        { count: "exact" }
      )
      .range(start, end);

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }

    const { data: result, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      data: result,
      total: count ?? 0,
      page: Number(page),
      limit: Number(limit),
    };
  },

  async getById(id) {
    const { data: result, error } = await supabase
      .from("medications")
      .select(
        `
          id, sku, name, description, price, quantity,
          categories ( id, name ),
          suppliers ( id, name, email, phone )
        `
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return result;
  },

  async create(payload) {
    if (payload.price < 0 || payload.quantity < 0) {
      throw new Error("Harga dan stok tidak boleh negatif");
    }

    const { data: result, error } = await supabase
      .from("medications")
      .insert(payload)
      .select();

    if (error) throw new Error(error.message);
    return result?.[0];
  },

  async update(id, payload) {
    if (payload.price !== undefined && payload.price < 0) {
      throw new Error("Harga tidak bisa negatif");
    }
    if (payload.quantity !== undefined && payload.quantity < 0) {
      throw new Error("Stok tidak bisa negatif");
    }

    const { data: result, error } = await supabase
      .from("medications")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);
    return result?.[0];
  },

  async remove(id) {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  async getTotal() {
    const { data: result, error } = await supabase
      .from("medications")
      .select("quantity");

    if (error) throw new Error(error.message);

    const total = result?.reduce(
      (sum, item) => sum + (item.quantity ?? 0),
      0
    );

    return { total };
  },
};
