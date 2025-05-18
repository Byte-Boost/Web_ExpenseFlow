'use client';
import { NavBar } from "@/app/modules/navbar/index";
import { getRefunds } from "../../../utils/endpoints";
import { useEffect, useState } from "react";
import { confirmationAlert } from "../../../utils/alerts";
import { MdMoreVert } from "react-icons/md";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const projectId = Number(params.projectId);
  const [refunds, setRefunds] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchRefunds = async () => {
      const response = await getRefunds(projectId);
      setRefunds(response);
    };
    fetchRefunds();
  }, [])

  let badges = {
    "default": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "new": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    "rejected": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "approved": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-process": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }
  let fancyScroll = "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <NavBar></NavBar>
      {
        refunds.length <= 0 ? (
          <div className="flex flex-col grow items-center justify-center py-2">
            <section className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Refunds
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                No refunds found.
              </p>
            </section>
          </div>
        ): 

        <div className="flex flex-col grow items-center justify-around py-2">
          <section className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Refunds
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {refunds.length} refunds found.
            </p>
          </section>

          <section className={fancyScroll+" grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 w-full max-w-7xl max-h-[40vh] p-4 mt-8 overflow-y-auto"}>
              {refunds.map((refund) => (

                <div key={refund.id} className="relative max-w-sm">
                  <a
                    href={`refunds/${refund.id}`}
                    className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 h-full cursor-pointer"
                  >
                    <p className="flex justify-between font-normal text-gray-700 dark:text-gray-400">
                      <span>
                        <span>#{refund.id}</span>
                        <span className={"ml-2 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm " + (badges[refund.status as keyof typeof badges] || badges.default)}>{refund.status}</span>
                      </span>
                      <span className="mr-5">{new Date(refund.date).toLocaleDateString()}</span>
                    </p>

                    <h5 className="mb-2 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
      }
    </main>
  );
}
