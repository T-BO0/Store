import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { router } from '../router/Router';
import { PaginatedResponse } from '../models/pagination';
import { store } from '../store/configureStore';

//explicit delay 1.
const sleep = () => new Promise(resolve => setTimeout(resolve,500));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responceBody = (responce: AxiosResponse) => responce.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async responce => {
    if(process.env.NODE_ENV === 'development') await sleep();
    const pagination = responce.headers['pagination'];
    if(pagination) {
        responce.data = new PaginatedResponse(responce.data, JSON.parse(pagination));
        return responce;
    }
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
            break;
        case 403:
            toast.error("you are not allowed");
            break;
        case 500:
            router.navigate('/server-error',  {state: {error: data}});
            break;
        default:
            break;
    }

    return Promise.reject(error.response);
});

const requests = {
    get: (url:string, params?: URLSearchParams) => axios.get(url, {params}).then(responceBody),
    post: (url:string, body:{}) => axios.post(url,body).then(responceBody),
    put: (url:string, body:{}) => axios.put(url,body).then(responceBody),
    delete: (url:string) => axios.delete(url).then(responceBody),
    postForm: (url:string, data: FormData) => axios.post(url, data, {
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(responceBody),
    putForm: (url:string, data: FormData) => axios.put(url, data, {
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(responceBody),
}

function createFormData(item: any){
    let formData = new FormData();
    for (const key in item){
        formData.append(key, item[key]);
    }
    return formData;
}



//admin
const Admin = {
    createProduct: (product: any) => requests.postForm('products', createFormData(product)),
    updateProduct: (product: any) => requests.putForm('products', createFormData(product)),
    deleteProduct: (id: number) => requests.delete(`products/${id}`),
}
//product calls
const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id:number) => requests.get(`products/${id}`),
    filters: () => requests.get('products/filters'),
}
//error calls
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get404Error: () => requests.get('buggy/not-found'),
    get401Error: () => requests.get('buggy/unauthorized'),
    validationError: () => requests.get('buggy/validation-error'),
    get500Error: () => requests.get('buggy/server-error'),
}
//Basket calls
const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId:number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem: (productId:number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}
//Account
const Account = {
    login: (value: any) => requests.post('account/login', value),
    register: (value: any) => requests.post('account/register', value),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress'),
}
//Orders
const Orders = {
    list: () => requests.get('order'),
    featch: (id:number) => requests.get(`order/${id}`),
    create: (values: any) => requests.post('order', values),
}
//stripe
const Payment = {
    createPaymentIntent: () => requests.post('payments', {}),
}




const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payment,
    Admin,
}
export default agent;