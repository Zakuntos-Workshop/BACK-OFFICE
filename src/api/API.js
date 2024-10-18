import {Component} from 'react';

class API extends Component {

  serverUrl = `${process.env.REACT_APP_API_URL}`;
  
  user = (sessionStorage.getItem('user') !== null) ? JSON.parse(sessionStorage.getItem('user')) : {access_token: null};
  access_token = (sessionStorage.getItem('access_token') !== null) ? sessionStorage.getItem('access_token') : { access_token: null };

  send = async (data, route = '', method = 'POST') => {
    try {
      let response = await fetch(this.serverUrl+'/'+route, {
        method: method,
        headers: this.getHeaders(data),
        body: data.fileNameAttrValues !== undefined ? this.createFormData(data) : JSON.stringify(data)
      });
  
      let responseJson = await response.json();

      return responseJson;

    } catch (error) {
      console.log('error: ', error);
      let errorResponse = {
        isError : true,
        error : error
      }
      return errorResponse
    }
  }
  
  async getData(route = '', method = 'GET',access_token=null) {

    if(access_token != null) this.access_token = access_token

    try {
        let response = await fetch(this.serverUrl+'/'+route, {
        method: method,
        headers: {
          'Authorization': 'Bearer ' +this.access_token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      let responseJson = await response.json();

      return responseJson;

    } catch (error) {
      return { error : error };
    }
  }

  createFormData = (data) => {

    const formData = new FormData();

    for (let index = 0; index < data.fileNameAttrValues.length; index++) {
      const attrName = data.fileNameAttrValues[index];
      data.file !== undefined && formData.append(attrName, data.files[index]);
    }

    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
  
    return formData;
  };

  getHeaders = (data) => {
    const defaultHeaders = {
      'Authorization': 'Bearer ' + this.access_token,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
    const formDataHeaders = {
      'Authorization': 'Bearer ' + this.access_token,
      'Accept': 'application/json',
    }

    const headers = data.fileNameAttrValues == undefined ? defaultHeaders : formDataHeaders;

    return headers;
  }

  getCurrentUser(){
    return JSON.parse(sessionStorage.getItem('user'));
  }

  getRate(){
    return JSON.parse(sessionStorage.getItem('rate'));
  }

  getFeatures(){
      let features = JSON.parse(localStorage.getItem('features'));
      features.map((feature1)=>{
        feature1['childs'] = [];
        feature1['child_urls'] = [];
        features.map((feature2)=>{
            if(feature2.feature_id == feature1.id){
              feature1['childs'].push(feature2)
              feature1['child_urls'].push(feature2.url)
            }
        })  
      })
      return features
  }

  isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  permission(url){
    const features = JSON.parse(localStorage.getItem('features'))
    let permission = null;
    if(features !== null ){
      for(let i=0;i<=features.length;i++){
        if(features[i]?.url === url){
          permission = features[i].permission
          break;
        }
      }
    }

    return permission
  }
  

  refreshUser = async () => {
    const user = await this.getCurrentUser();
    const fresh_user = await this.getData(`user/${user.id}`);
    if(fresh_user.id !== undefined ){
      sessionStorage.setItem('user', JSON.stringify(user));
      this.refreshFeatures(user)
    }
  }

  refreshFeatures = async () => {
    const features = await this.getData('features?page=1&per_page=50');
    const  user = this.getCurrentUser()

    if(features.length > 0 && user != null){  
      this.refreshPermissions(features, user)
    }
  }

  refreshPermissions = async (features, user) => {
    const permissions = await this.getData('permissions/role/'+user.role_id);
    
    this.setState({permissions:permissions.data});
    
    if(permissions.length > 0){
      features.map((feat,i)=>{
        permissions.map((permission)=>{
            if(permission.feature_id === feat.id){
              this.state.features[i]['permission'] = permission
            }
        })   
      })
      sessionStorage.setItem("features", JSON.stringify(this.state.features));
    }
  }

  logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("features");
  }
}

export default API;
