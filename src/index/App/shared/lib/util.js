export const trimLower = str => {
   return !str ? 'no string provided' : str.replace(/\s/g, "").toLowerCase()
}

export const compareStrings = (str1,str2) => {
   if(!str1 || !str2){
      return false
   }
   return trimLower(str1).includes(trimLower(str2))
}

export const formatDate = dateStr => !dateStr ? 'no string' : dateStr.split(' ').join('-') 

export function reverseString(s){
   return s.split("").reverse().join("");
}