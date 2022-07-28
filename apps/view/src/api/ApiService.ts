import axios from "axios";


const baseUrl = 'http://localhost:3000/api/v1';

const getBaseUrl = () => {
    return baseUrl;
}

const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-type": "application/json",
    },
});


const getLiquidityPairs = async (): Promise<any> => {
    const response =
        await apiClient.get(`/redis/liquidityPairs`);

    return response.data;
}

const ApiService = {
    getBaseUrl,

    getLiquidityPairs,

}
export default ApiService;