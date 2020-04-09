 export class GetDataClass {
  constructor(data){
    this.data = data;
  }
  getColumns(){
    let columns = [];
    columns.push('date');
    for(let i of this.data){
      columns.push(`${i.name}(${i.unit})`)
    }
    return columns
  }
  getRows(){
    let rows = [];
    let item = [];
    for(let i of this.data[0].value){
      rows.push({'date':i.date});
    }
    for(let i of this.data){
      for (let n in i.value){
        let key = Symbol()
        key= `${i.name}(${i.unit})`
        rows[n][key]=i.value[n].value
      }
    }
    return rows
  }
  getlastData(){
    let lastdata = [];
    for(let i of this.data){
      lastdata.push({
        name: i.name,
        ename: i.ename,
        unit: i.unit,
        value: i.value[i.value.length - 1].value
      })
    }
    return lastdata
  }
}
