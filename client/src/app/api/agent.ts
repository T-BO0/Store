import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { router } from '../router/Router';

const sleep = () => new Promise(resolve => setTimeout(resolve,500));

axios.defaults.baseURL = 'http://localhost:5152/api/';

const responceBody = (responce: AxiosResponse) => responce.data;

axios.interceptors.response.use(async responce => {
    await sleep();
   return responce;
}, (error: AxiosError)=>{
    const {data, status} = error.response as AxiosResponse;
    switch(status){
        case 400:
            if(data.errors){
                const modelStateError: string[] = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateError.push(data.errors[key]);
                    }
                }
                throw modelStateError.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break
        case 500:
            router.navigate('/server-error',  {state: {error: data}});
            break;
        default:
            break;
    }

    return Promise.reject(error.response);
});

const requests = {
    get: (url:string) => axios.get(url).then(responceBody),
    post: (url:string, body:{}) => axios.post(url,body).then(responceBody),
    put: (url:string, body:{}) => axios.put(url,body).then(responceBody),
    delete: (url:string) => axios.delete(url).then(responceBody),
}



const Catalog = {
    list: () => requests.get('products'),
    details: (id:number) => requests.get(`products/${id}`),

}


const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get404Error: () => requests.get('buggy/not-found'),
    get401Error: () => requests.get('buggy/unauthorized'),
    validationError: () => requests.get('buggy/validation-error'),
    get500Error: () => requests.get('buggy/server-error'),
}


const agent = {
    Catalog,
    TestErrors,
}


export default agent;