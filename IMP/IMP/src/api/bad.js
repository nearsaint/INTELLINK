

class robot {
  constructor(eventList) {
    //事件监听集合
    this.eventList = eventList;
  }

  //添加事件
  eventAdd: (event) => {
    this.eventList.push(event)
  },

  //删除事件
  eventRemove: (event) => {
    this.eventList.splice(event,1)
  },

  //触发事件
  eventWork: () => {

    //这里用随机代替
    let redom = this.eventLis[Math.floor(this.eventList.length * Math.random())]
    this.event.apply(redom)
  },

}
let robot = new robot();
setInterval(robot.eventWork(),"1000");
