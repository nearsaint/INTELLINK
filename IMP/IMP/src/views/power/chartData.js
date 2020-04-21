 export class DataStatistics {
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


export class DataAnalysis{
  constructor(data){
    this.data = data;
  }

  getColumns(project){
    let columns = [`${project}`,'电能耗(KW/H)'];
    return columns
  }
  getRows(project){
    let rows = [];
    let key = Symbol()
    key = project
    for(let i of this.data){
      rows.push({
        [key] :`${project}: ${i.project_name}`,
        '电能耗(KW/H)': i.value,
      })
    }
    return rows
  }
  getZoom(){
    let length = this.data.length;
    let zoomEnd = 100;
    if(length<=10){
    }else{
      zoomEnd = 100*(10/length)
    }
    return zoomEnd
  }
}
