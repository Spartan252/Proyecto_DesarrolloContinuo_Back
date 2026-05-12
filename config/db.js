let d1Binding = null;

export const setD1Binding = (binding) => {
  d1Binding = binding;
};

const query = async (sql, params = []) => {
  if (!d1Binding) throw new Error('D1 binding not initialized. Call setD1Binding(env.DB) first.');

  const stmt = d1Binding.prepare(sql);

  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const { results } = await stmt.bind(...params).all();
    return [results];
  } else {
    const result = await stmt.bind(...params).run();
    return [{ insertId: result.meta.last_row_id ?? null, affectedRows: result.meta.changes }];
  }
};

export const db = { query, execute: query };

export default db;
