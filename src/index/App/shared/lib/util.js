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

export const chooseColor = (status) => {
   switch(trimLower(status)){
     case 'open':
       return 'black'

     case 'closed':
       return 'red'

     case 'participating':
       return 'green'
   }
 }

export const determineCell = (value) => {
   return !value ? '' : value
}