/**
 * safe json prase
 * @param jsonString
 * @returns
 */
export function safeJsonParse(jsonString: string | null) {
  let res = null
  try {
    res = JSON.parse(jsonString ?? '')
  } catch (e) {
    // console.trace(e)
  }
  return res
}
