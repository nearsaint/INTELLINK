import http from 'api/Axios'

// export const get_X = data => Http.get('api/x', data);
// export const post_X = data => Http.post('api/x', data);
// export const put_X = data => Http.put('api/x', data);
// export const patch_X = data => Http.patch('api/x', data);
// export const delete_X = data => Http.delete('api/x', data);



//DASHBOARD
export const DASHBOARD_CONTAINER_LIST = (data) =>
  http.get('/api/DASHBOARD_CONTAINER_LIST', data);

export const DASHBOARD_CONTAINER_ADD = (data) =>
  http.post('/api/DASHBOARD_CONTAINER_ADD', data);

export const DASHBOARD_CONTAINER_EDIT = (data) =>
  http.patch('/api/DASHBOARD_CONTAINER_EDIT', data);

export const DASHBOARD_CONTAINER_DEL = (data) =>
  http.delete('/api/DASHBOARD_CONTAINER_DEL', data);

export const DASHBOARD_CONTAINER_GS = (data) =>
  http.put('/api/DASHBOARD_CONTAINER_GS', data);


//device
export const DEVICE_FS = (data) =>
  http.put('/api/DASHBOARD_CONTAINER_GS', data);

export const DEVICE_EQUIPMENTS = (status,page) =>
  http.get('/api/get_equipments?status='+status+'&page='+page);

export const DEVICE_PARTS = (page) =>
  http.get('/api/get_parts?page='+page);

//energy
export const ENERGY_ORDER_LINE = () =>
  http.get('/api/GET_ORDER_LINE')

export const ENERGY_STATISTICAL = (order,interval) =>
  http.get('/api/GET_ENERGY_STATISTICAL?order='+order+'&interval='+interval)

export const ENERGY_AREA_PROJECT = () =>
  http.get('/api/GET_AREA_PROJECT')

export const ENERGY_ANALYSIS = (area,project) =>
  http.get('/api/ENERGY_ANALYSIS?area='+area+'&project='+project)

//DATA
export const DATA_LIST = () =>
  http.get('/api/DATA_LIST');
export const DATA_GET_ID = () =>
  http.get('/api//DATA_GET_ID');
