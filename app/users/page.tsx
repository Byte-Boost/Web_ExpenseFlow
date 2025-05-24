"use client";
import { NavBar } from "@/app/modules/navbar/index";
import { useEffect, useState } from "react";
import { confirmationAlert, failureAlert, successAlert } from "../utils/alerts";
import { getProjects, getUsers, setSubscriptions } from "../utils/endpoints";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ToggleSwitch } from "flowbite-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [selectedProjects, setSelectedProjects] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  async function handleProjectToggle(projId: number) {
    if (selectedProjects.includes(projId)) 
      setSelectedProjects(selectedProjects.filter((id: number) => id !== projId));
    else 
      setSelectedProjects([...selectedProjects, projId]);
  }

  async function setUserProjects(userId: number, projectIds: number[]) {
    return await setSubscriptions(userId, projectIds);
  }

  const fetchProjects = async () =>{
    const response = await getProjects();
    setProjects(response);
  }

  const fetchUsers = async () => {
    await fetchProjects();
    const response = await getUsers();
    setIsLoading(false);
    setUsers(response);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(()=>{
    if (selectedUser) {
      const userProjects = selectedUser.Projects.map((project: any) => project.id);
      setSelectedProjects(userProjects);
    } else {
      setSelectedProjects([]);
    }
  }, [selectedUser])

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <NavBar></NavBar>
      
      <div className="overflow-auto max-h-[600px] p-4">
        <table className="w-full text-left border-collapse text-black dark:text-gray-400 table-fixed">
          <thead>
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user:any, index) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    <HiOutlinePencilAlt className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <Modal className="text-black dark:text-gray-400" show={true} onClose={() => setSelectedUser(null)} dismissible>
          <ModalHeader theme={{close: {base: 'text-black dark:text-gray-400 cursor-pointer',}}}>
            Editar Projetos do Usuário
          </ModalHeader>
          <ModalBody className="fancyScroll">
            <div className="mb-4">
              <p className="font-semibold">Email:</p>
              <p>{selectedUser.email}</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Projects:</p>
              {projects.map((project:any) => {
                return (
                  <div key={project.id} className="flex items-center mb-2">
                    <div className="flex items-center justify-between py-2 gap-2">
                      <ToggleSwitch
                        className="aria-[checked=false]:*:dark:bg-gray-600"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleProjectToggle(project.id)}
                        color="blue"
                      />
                      <span>{project.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="cursor-pointer"
              onClick={() => {
                setUserProjects(selectedUser.id, selectedProjects).then((res)=>{
                  fetchUsers();
                  successAlert("Alterações salvas com sucesso", "user projects updated");
                }).catch(err=>{
                  console.log(err);
                  failureAlert("Erro ao salvar as alterações", "something went wrong while setting user projects");
                });
              }}
            >
              Save
            </Button>
            <Button color="gray" className="cursor-pointer" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </main>
)
};
