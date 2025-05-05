import instance from './api_instance';

// User related endpoints
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