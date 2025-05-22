"use client";
import { NavBar } from "@/app/modules/navbar/index";
import { createProject, deleteProject, getProjects } from "../utils/endpoints";
import { useEffect, useState } from "react";
import { confirmationAlert } from "../utils/alerts";
import { MdMoreVert } from "react-icons/md";
import { Dropdown, DropdownItem, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function createNewProject(name: string) {
    const response = await createProject(name);
    const projects = await getProjects();
    setProjects(projects);

    return response;
  }

  async function deleteProjectById(id: any) {
    confirmationAlert(
      "Você tem certeza que deseja deletar o projeto?",
      `Projeto ${id} deletado`,
      async () => {
        const response = await deleteProject(id);
        const projects = await getProjects();
        setProjects(projects);

        return response;
      },
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects();
      setIsLoading(false);
      setProjects(response);
    };
    fetchProjects();
  }, []);

  let fancyScroll =
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500";
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <NavBar></NavBar>
      {projects.length <= 0 ? (
        <div className="flex grow flex-col items-center justify-center py-2">
          <section className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            {isLoading ? (
              <Spinner color="purple" className="m-20 scale-200" />
            ) : (
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                No projects found.
              </p>
            )}
          </section>

          {creatingProject && (
            <section
              className={
                fancyScroll +
                " mt-8 grid max-h-[40vh] w-full max-w-7xl grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 overflow-y-auto p-4"
              }
            >
              <a className="block h-full max-w-sm cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Give a name to the project
                </p>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h5>
                <input
                  name="refundLimit"
                  type="text"
                  value={projectName}
                  onChange={handleInputChange}
                  className="mt-1 flex w-full rounded border bg-white p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const newProject = e.currentTarget.value;

                      if (newProject) {
                        createNewProject(newProject).then((response) => {});
                      }
                      setProjectName("");
                      setCreatingProject(false);
                    }
                  }}
                />
              </a>
            </section>
          )}

          <section className="flex flex-col items-center justify-center">
            <div className="mt-8">
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => {
                  setCreatingProject(!creatingProject);
                }}
              >
                Criar um novo projeto
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="justify-mt-20 mt-20 flex grow flex-col items-center py-2">
          <section className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Projetos
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {projects.length} projetos encontrados.
            </p>
          </section>

          <section
            className={
              fancyScroll +
              " mt-8 grid max-h-[40vh] w-full max-w-7xl grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 overflow-y-auto p-4"
            }
          >
            {projects.map((project) => (
              <div key={project.id} className="relative max-w-sm">
                <a
                  href={`/projects/${project.id}`}
                  className="block h-full cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <p className="flex justify-between font-normal text-gray-700 dark:text-gray-400">
                    <span>{project.id}</span>
                  </p>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {project.name}
                  </h5>
                </a>

                <div className="absolute top-2 right-2 z-10">
                  <Dropdown
                    className=""
                    label=""
                    placement="right"
                    renderTrigger={() => (
                      <button className="cursor-pointer rounded p-2 hover:bg-black/20 dark:text-white">
                        <MdMoreVert className="h-4 w-4" />
                      </button>
                    )}
                  >
                    <DropdownItem
                      onClick={() => {
                        router.push("projects/" + project.id + "/refunds");
                      }}
                    >
                      Reembolsos
                    </DropdownItem>

                    <DropdownItem
                      onClick={() => {
                        if (project.id) deleteProjectById(project.id);
                      }}
                    >
                      <span className="text-red-500">Excluir</span>
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            ))}
            {creatingProject && (
              <a className="block h-full max-w-sm cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Dê um nome ao projeto
                </p>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h5>
                <input
                  name="refundLimit"
                  type="text"
                  value={projectName}
                  onChange={handleInputChange}
                  className="mt-1 flex w-full rounded border bg-white p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const newProject = e.currentTarget.value;

                      if (newProject) {
                        createNewProject(newProject).then((response) => {
                          setCreatingProject(false);
                        });
                      }
                      setProjectName("");
                      setCreatingProject(false);
                    }
                  }}
                />
              </a>
            )}
          </section>

          <section className="flex flex-col items-center justify-center">
            <div className="mt-8">
              <button
                className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => {
                  setCreatingProject(!creatingProject);
                }}
              >
                Criar um novo projeto
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
