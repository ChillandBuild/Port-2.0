/**
 * The one token-substitution rule for every admin-editable template — chatbot
 * answers and email bodies alike. `{{token}}` is replaced by the matching key
 * in `tokens`; an unknown token is left as literal text rather than silently
 * vanishing, so a typo in an admin edit is visible in the sent output instead
 * of hidden.
 */
export function interpolate(text: string, tokens: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in tokens ? tokens[key] : match));
}
