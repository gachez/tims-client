/*
Please note this library cannot handle large files i.e 30k+ rows.
You will need to replace with XLSX library for better perfomance 
*/
import readXlsxFile from 'read-excel-file' 
import _CONFIG from '../../../../../config/config'
import { formatDate } from '../util'

const importFileTender = (input, currentUser) => {
  readXlsxFile(input.files[0]).then((rows) => {
    //first row is the headers for the file
    let tenderData = []
    rows.slice(1).forEach((imports,index) => {
      tenderData.push({
        dateSeen: formatDate(imports[0]),
        organisation: imports[1],
        tenderName: imports[2],
        eligibility: imports[3],
        closingDate: imports[4],
        status: !imports[5] ? '': imports[5],
        uploadedBy: currentUser
      })
    })

    for(let tender of tenderData.filter(tenderRecord => tenderRecord.closingDate)){
      try{
          fetch(_CONFIG.API_URI+"/api/v1/admin/tender", {
              method: 'POST', 
              headers: {
                  'Content-Type': 'application/json',
                  'auth-token': `${localStorage.getItem('auth-token')}`
              },
              body: JSON.stringify(tender),
              })
              .then(response => response.json())
              .then(dat => {
              console.log('Success uploaded tender:', dat);
              })
              .catch((error) => {
              console.error('Error:', error);
              });
      } catch(err) {
          console.log(err)
          break
      }
      
  }
  alert('Succesfully imported file data');
  })
}

export default importFileTender