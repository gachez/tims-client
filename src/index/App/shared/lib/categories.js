module.exports.categories = [
    {
        industry: 'Banks',
        subSector: ``

    }]
//add new category or subsector
const addCategory = (data) => {
    console.log('adding category..');
    this.categories.push(data);
}

//update a category or add subsector
const updateCategory = (n,data) => {
    console.log("adding subsector");
    this.categories.splice(n,0,data);
}

module.exports.addCategory = addCategory;