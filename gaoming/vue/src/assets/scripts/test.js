import './plugin/jquery-2.1.4.min.js'
// import './plugin/jquery.signalR-2.1.2.min.js'



export function connect() {
  let hub = $.hubConnection('http://192.168.0.13:3150');
  let chat = $.connection.rTHub;
  hub.start({
    xdomain: true
  }).done(() => {
    console.log("success");
    console.log(proxy);
    console.log(proxy.invoke);
    chat.server.doorControlSingle(1, 1)
  }).fail((data) => {
    console.log('conn fail')
  });
}

export function jslink() {
  var  body = document.getElementsByTagName('body')[0];
  var  scriptSignalr = document.createElement('script');
  var  scriptHubs = document.createElement('script');
  scriptSignalr.type = 'text/javascript';
  scriptSignalr.src = 'https://cdn.bootcss.com/signalr.js/2.4.0-preview1-20180920-03/jquery.signalR.min.js';
  scriptHubs.type = 'text/javascript';
  scriptHubs.src = 'http://192.168.0.13:3150/signalr/hubs';
  body.appendChild(scriptSignalr);
  console.log(scriptSignalr)
  body.appendChild(scriptHubs);
  console.log(scriptHubs)
}