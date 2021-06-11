export const trimLower = str => {
   return !str ? 'no string provided' : str.replace(/\s/g, "").toLowerCase()
}