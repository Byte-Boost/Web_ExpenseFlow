import instance from './api_instance';

// User related endpoints
export async function registerUser(email: string, password: string){
    const response = await instance.post("user/register", {
        "email": email,
        "password": password
    });
    return response.data;
}
export async function sendLogin(email: string, password: string) {
    try{
        const response = await instance.post("user/login", {
            "email": email,
            "password": password
        })
        return response.data
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}
export async function setSubscriptions(userId: number, projectIds: number[]) {
    try{
        const response = await instance.put("user/setSubscriptions", {
            "userId": userId,
            "projectIds": projectIds
        })
        return response.data
    } catch (error) {
        console.error("Error setting subscriptions in:", error);
        throw error;
    }
}
export async function getUsers() {
    const response = await instance.get("user");
    return response.data;
}

// Project related endpoints
export async function createProject(name: string, preferences: ProjectPreference | null = null) {
    const response = await instance.post("project", {
        "name": name,
        "preferences": preferences
    });

    return response.data;
}
export async function getProjects() {
    const response = await instance.get<Array<Project>>("project");
    return response.data;
}
export async function getProject(id: number) {
    const response = await instance.get<Project>(`project/${id}`);
    return response.data;
}
export async function updatePreference(id: number, preference: ProjectPreference) {
    const response = await instance.put(`project/preferences/${id}`, {
        refundLimit: preference.refundLimit,
        expenseLimit: preference.expenseLimit,
        quantityValues: preference.quantityValues
    });
    return response.data;
}
export async function deleteProject(id: number) {
    const response = await instance.delete<Project>(`project/${id}`);
    return response.data;
}

// Refund related endpoints
export async function getRefunds(projectId: number|null=null) {
    const response = await instance.get<any>("refund", {
        params: {
            projectId: projectId
        }
    });
    return response.data;
}
export async function getRefundById(refundId: number) {
    const response = await instance.get<any>(`refund/${refundId}`);
    return response.data;
}
export async function getExpenseById(expenseId: string) {
    const response = await instance.get<any>(`refund/expense/${expenseId}`);
    return response.data;
}
export async function processRefund(refundId: number, authorize: boolean, reason: string|null = null) {
    const response = await instance.patch<any>(`refund/${refundId}/authorize`, {
        rejectionReason: reason
    }, {
        params: {
            approved: authorize
        }
    });
    return response.data;
}