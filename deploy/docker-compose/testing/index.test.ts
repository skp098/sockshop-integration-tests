const axios = require('axios').default;
const api_base_url = 'http://localhost';
var user_id = null;
const axiosInstance = axios.create({ baseURL: api_base_url });

describe('catalogue apis', ()=>{

    it('get existing catalogues',async ()=>{        
        const response = await axios.get(`${api_base_url}/catalogue`);
        expect(response.status).toEqual(200);        
    })

    it('get single existing catalogues',async ()=>{
        const response = await axios.get(`${api_base_url}/catalogue`);
        if(response.status==200){
            var p_id = response.data[0]['id'];
            const product_response = await axios.get(`${api_base_url}/catalogue/${p_id}`);
            expect(typeof product_response.data.status_code).toEqual('undefined');
        }else{
            expect(true).toBeFalse();
        }
    })
        

    it('registering a user',async ()=>{   
        const randomKey = (Math.random() + 1).toString(36).substring(7);
        var user_data = {username:"Santosh "+randomKey,password:"Hello@123",email:`skp${randomKey}@gmail.com`};     
        const response = await axios.post(`${api_base_url}/register`,user_data);
        user_id = response.data.id;     
        console.log(user_id);
        expect(response.status).toEqual(200);
        
        const del_response = await axios.delete(`${api_base_url}/customers/${user_id}`);                    
        const status_code = JSON.parse(del_response.data).status_code;                        
        expect(typeof status_code).toEqual('undefined');        

    })

    // it('deleting the created a user',async ()=>{    
    //     console.log("userid: "+user_id);
    //     const response = await axios.delete(`${api_base_url}/customers/${user_id}`);                    
    //     const status_code = JSON.parse(response.data).status_code;                        
    //     expect(typeof status_code).toEqual('undefined');
    // })  

    it('logging in a user',async ()=>{

        var username = 'user';
        var password = 'password'

        const token = `${username}:${password}`;
        const encodedToken = Buffer.from(token).toString('base64');        

        var config = {
          method: 'get',
          url: `${api_base_url}/login`,
          headers: { 'Authorization': 'Basic '+ encodedToken }
        };

        const response = await axios(config);        
        const cookie = response.headers["set-cookie"];
        axiosInstance.defaults.headers.Cookie = cookie;        
        expect(response.data).toEqual('Cookie is set');
        
    })


    it('getting orders of the user',async ()=>{            
        const response = await axiosInstance.get(`${api_base_url}/orders`,{ withCredentials: 'same-origin' });                    
        console.log(response.status);
        expect(response.status).toEqual(201);
    }) 


})