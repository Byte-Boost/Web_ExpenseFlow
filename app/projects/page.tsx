'use client';
import { NavBar } from "@/app/modules/navbar/index";
import { FaTrash } from 'react-icons/fa';
import { createProject, deleteProject, getProjects } from "../utils/endpoints";
import { useEffect, useState } from "react";
import { confirmationAlert } from "../utils/alerts";

export default function Home() {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  
  async function createNewProject(name: string){
    const response = await createProject(name);
    const projects = await getProjects();
    setProjects(projects);

    return response;
  };

  async function deleteProjectById(id: any){
    confirmationAlert("Você tem certeza que deseja deletar o projeto?", `Projeto ${id} deletado`, async () => {
      const response = await deleteProject(id);
      const projects = await getProjects();
      setProjects(projects);
  
      return response;
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  }

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects();
      setProjects(response);
    };
    fetchProjects();
  }, [])


  let fancyScroll = "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <NavBar></NavBar>
      {
        projects.length <= 0 ? (
          <div className="flex flex-col grow items-center justify-center py-2">
            <section className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Projects
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                No projects found.
              </p>
            </section>

            {
              creatingProject && (
                <section className={fancyScroll+" grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full max-w-7xl max-h-[40vh] p-4 mt-8 overflow-y-auto"}>
                  <a className="max-w-sm block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 h-full cursor-pointer">
                    <p className="font-normal text-gray-700 dark:text-gray-400">Give a name to the project</p>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h5>
                    <input
                        name="refundLimit"
                        type="text"
                        value={projectName}
                        onChange={handleInputChange}
                        className="p-2 w-full flex mt-1 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const newProject = e.currentTarget.value

                            if (newProject) {
                              createNewProject(newProject).then((response) => {

                              })
                            }
                            setProjectName("");
                            setCreatingProject(false);
                          }
                      }}
                    />
                  </a>
                </section>
              )
            }

            <section className="flex flex-col items-center justify-center">
              <div className="mt-8">
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={()=>{
                    setCreatingProject(!creatingProject)
                  }}
                >
                  Create New Project
                </button>
              </div>
            </section>  
          </div>
        ): 

        <div className="flex flex-col grow items-center justify-around py-2">
          <section className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {projects.length} projects found.
            </p>
          </section>

          <section className={fancyScroll+" grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full max-w-7xl max-h-[40vh] p-4 mt-8 overflow-y-auto"}>

              {projects.map((project) => (
                <a
                href={`/projects/${project.id}`}
                key={project.id}
                className="max-w-sm block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 h-full cursor-pointer"
              >
                <p className="flex justify-between font-normal text-gray-700 dark:text-gray-400">
                  <span>{project.id}</span>
                  <button className="bg-red-800 hover:bg-red-900 text-white p-2 rounded cursor-pointer" onClick={(e)=>{
                    e.preventDefault()
                    if (project.id) deleteProjectById(project.id)
                  }}>
                    <FaTrash className="w-4 h-4" />
                  </button>
                </p>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.name}</h5>
              </a>
              
              ))}
              {
                creatingProject && (
                  <a className="max-w-sm block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 h-full cursor-pointer">
                    <p className="font-normal text-gray-700 dark:text-gray-400">Give a name to the project</p>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h5>
                    <input
                        name="refundLimit"
                        type="text"
                        value={projectName}
                        onChange={handleInputChange}
                        className="p-2 w-full flex mt-1 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const newProject = e.currentTarget.value

                            if (newProject) {
                              createNewProject(newProject).then((response) => {
                                setCreatingProject(false);
                              })
                            }
                            setProjectName("");
                            setCreatingProject(false);
                          }
                      }}
                    />
                  </a>
                )
              }

          </section>
          
          <section className="flex flex-col items-center justify-center">
            <div className="mt-8">
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
                onClick={()=>{
                  setCreatingProject(!creatingProject)
                }}
              >
                Create New Project
              </button>
            </div>
          </section>
        </div>
      }
    </main>
  );
}
