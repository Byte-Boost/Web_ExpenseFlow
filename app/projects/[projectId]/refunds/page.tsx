"use client";
import { NavBar } from "@/app/modules/navbar/index";
import { getProject, getRefunds } from "../../../utils/endpoints";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.projectId);
  const [projectName, setProjectName] = useState("");
  const [refunds, setRefunds] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRefunds = async () => {
      const projResponse = await getProject(projectId);
      const response = await getRefunds(projectId);
      setIsLoading(false);
      setRefunds(response);
      setProjectName(projResponse.name);
    };
    fetchRefunds();
  }, []);

  let badges = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    new: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-process":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <NavBar></NavBar>

      {refunds.length <= 0 ? (
        <div className="flex grow flex-col items-center justify-center py-2">
          <section className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative">
              <span onClick={()=>{
                  router.push("/projects");
                }} className="absolute">
                <FaArrowLeft className="w-8 h-8 p-1 absolute -left-12 aspect-square rounded-full border-solid border-2 cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-400"></FaArrowLeft>
              </span>
              Reembolsos
            </h1>
            {isLoading ? (
              <Spinner color="purple" className="m-20 scale-200" />
            ) : (
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Nenhum reembolso encontrado.
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="flex grow flex-col items-center justify-start py-2">
          <section className="mt-20 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white relative">
              <span onClick={()=>{
                  router.push(`/projects/${projectId}`);
                }} className="absolute">
                <FaArrowLeft className="w-8 h-8 p-1 absolute -left-10 top-1 aspect-square rounded-full border-solid border-2 cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-400"></FaArrowLeft>
              </span>
              {projectName} - Reembolsos
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {refunds.length} reembolsos encontrados.
            </p>
          </section>

          <section
            className="fancyScroll mt-8 grid max-h-[40vh] w-full max-w-7xl grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 overflow-y-auto p-4"
          >
            {refunds.map((refund) => (
              <div key={refund.id} className="relative max-w-sm">
                <a
                  href={`refunds/${refund.id}`}
                  className="block h-full cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <p className="flex justify-between font-normal text-gray-700 dark:text-gray-400">
                    <span>
                      <span>#{refund.id}</span>
                      <span
                        className={
                          "me-2 ml-2 rounded-sm px-2.5 py-0.5 text-sm font-medium " +
                          (badges[refund.status as keyof typeof badges] ||
                            badges.default)
                        }
                      >
                        {refund.status}
                      </span>
                    </span>
                    <span className="mr-5">
                      {new Date(refund.date).toLocaleDateString()}
                    </span>
                  </p>

                  <h5 className="mt-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Solicitante: {refund.User.email.split("@")[0]}
                  </h5>

                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Total: R${refund.totalValue.toFixed(2)}
                  </h5>
                </a>
              </div>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
