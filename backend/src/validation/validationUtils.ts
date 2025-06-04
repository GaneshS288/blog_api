/**
 * This function takes in a string and if the string contains any of these characters (<>&'"/),
 * it replaces them with html entities. 
 * @param text 
 * @returns a string that has (<>%'"/) replaced with html entities
 */

function escapeHtml (text: string) {
  const map: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&#39;",
    '"': "&quot;",
    "/": "&#47;",
  };
  return text.replace(/[<>&'"/]/g, (char: string): string => map[char]);
};


export { escapeHtml };

