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