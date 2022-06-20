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


export function safeJsonStringify (data) {
  let res = ''
  try {
    res = JSON.stringify(data ?? '')
  } catch (e) {
    // console.trace(e)
  }
  return res
}