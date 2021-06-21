import XLSX from 'xlsx';

const handleFile = async () => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
 
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
  
        this.setState({ 
            data: data
         },
          () => {
            var dataArr = []
            console.log(this.state.data.length)
              this.state.data.forEach( (imports,index) => {
                 let dataObj = {    
                    organization: imports['ORGANISATION'],
                    website: imports['WEBSITE '], 
                    contacts: imports['CONTACTS'],
                    contactPerson: imports['CONTACT PERSON'],
                    telephone: imports['TELEPHONE'],
                    designation: imports['DESIGNATION'],
                    emailAddress: imports['EMAIL ADDRESS'],
                    physicalLocation: imports[' Physical Location'],
                    industry: !imports['INDUSTRY'] ? wsname : imports['INDUSTRY'],
                    collectionDate: new Date().toUTCString(),
                    collectionTime: new Date().toUTCString(),
                    submittedBy: 'admin'
                }; 
                dataArr.push(dataObj)
            });
            console.log(dataArr)
            for(let dataOb of dataArr){
                try{
                    fetch(_CONFIG.API_URI+"/api/v1/admin/add_record", {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': `${localStorage.getItem('auth-token')}`
                        },
                        body: JSON.stringify(dataOb),
                        })
                        .then(response => response.json())
                        .then(dat => {
                        console.log('Success uploaded record:', dat);
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
            this.reloadPage()
           
        });
    };
 
    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    }
  }