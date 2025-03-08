import { API_BASE_URL } from "@/constant/web";
import { request } from "@/request";

export interface Recruit {
    id: number;
    name: string;
    description: string;

    startDate: string;
    endDate: string;
}
const baseURL = API_BASE_URL + '/user/recruit';
export const fetchRecruitList = async () => {
    return request.get<Recruit[]>(baseURL + '/list');
}

export const fetchRecruitDetail = async (id: number) => {
    return request.get<Recruit>(baseURL + '/detail/' + id);
}