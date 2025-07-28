// client/utils/fuzzyMatch.js
export function fuzzyMatch(users, key, query) {
  if (!query) return [];
  return users.filter((user) =>
    user[key]?.toLowerCase().includes(query.toLowerCase())
  );
}
