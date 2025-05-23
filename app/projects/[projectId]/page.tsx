"use client";
import { NavBar } from "@/app/modules/navbar/index";
import { getProject, updatePreference } from "@/app/utils/endpoints";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "flowbite-react";
import { FaArrowLeft } from "react-icons/fa";

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.projectId);
  const [addingQuantity, setAddingQuantity] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectPreference>({
    refundLimit: 0,
    expenseLimit: 0,
    quantityValues: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };
  const handleQuantityValueChange = (index: any, key: any, value: any) => {
    const updated = [...(formData?.quantityValues || [])];
    updated[index][key] = parseFloat(value);
    setFormData((prev: any) => ({
      ...prev,
      quantityValues: updated,
    }));
  };
  const removeQuantityValue = (key: any) => {
    const updated = [...(formData?.quantityValues || [])];
    const index = updated.findIndex(
      (value: any) => Object.keys(value)[0] === key,
    );
    if (index !== -1) {
      updated.splice(index, 1);
      setFormData((prev: any) => ({
        ...prev,
        quantityValues: updated,
      }));
    }
  };
  async function updateProjectPreferences(preference: ProjectPreference) {
    const response: any = await updatePreference(projectId, preference);
    return response;
  }

  useEffect(() => {
    const fetchProject = async () => {
      const response = await getProject(projectId);
      setIsLoading(false);
      setProject(response);
      if (response.preferences) setFormData(response.preferences);
    };
    fetchProject();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <NavBar></NavBar>

      <div className="mt-20 flex grow flex-col items-center justify-start py-2">
        {isLoading ? (
          <Spinner color="purple" className="m-20 scale-200" />
        ) : (
          <section className="flex min-w-lg flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 relative">
              <span onClick={()=>{
                  router.push("/projects/" + projectId + "/refunds");
              }}>
                <FaArrowLeft className="w-8 h-8 p-1 absolute -left-12 aspect-square rounded-full bg-white border-black dark:bg-gray-800 dark:text-white dark:border-white border-solid border-2 cursor-pointer"></FaArrowLeft>
              </span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              #{projectId} - {project?.name}
            </h1>
            <form
              className="mt-4 w-full max-w-xl space-y-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              onSubmit={(e) => {
                e.preventDefault();
                updateProjectPreferences(formData as ProjectPreference).then(
                  (response) => {
                    console.log(response);
                  },
                );
              }}
            >
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Limite de Reembolsos
                </label>
                <div className="mt-1 flex w-full rounded border bg-white text-gray-700 focus-within:ring-2 focus-within:ring-gray-400 dark:bg-gray-800 dark:text-gray-200">
                  <span className="p-2">R$</span>
                  <input
                    name="refundLimit"
                    type="number"
                    value={formData?.refundLimit}
                    onChange={handleInputChange}
                    className="grow border-none bg-transparent p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Limite de Despesas
                </label>
                <div className="mt-1 flex w-full rounded border bg-white text-gray-700 focus-within:ring-2 focus-within:ring-gray-400 dark:bg-gray-800 dark:text-gray-200">
                  <span className="p-2">R$</span>
                  <input
                    name="expenseLimit"
                    type="number"
                    value={formData?.expenseLimit}
                    onChange={handleInputChange}
                    className="grow border-none bg-transparent p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Valores de Quantidade
                </label>
                {formData?.quantityValues.map((value, index) => {
                  const key = Object.keys(value)[0];
                  return (
                    <div
                      key={index}
                      className="mt-1 flex items-center justify-between gap-2 text-gray-700 dark:text-gray-200"
                    >
                      <span>
                        <button
                          type="button"
                          className="cursor-pointer rounded bg-red-600 px-4 py-0 font-bold text-white hover:bg-red-700"
                          onClick={() => {
                            removeQuantityValue(key);
                          }}
                        >
                          -
                        </button>
                        <span className="ml-2 text-sm font-semibold">
                          {key}
                        </span>
                      </span>

                      <div className="max-w-3xl rounded border bg-white focus-within:ring-2 focus-within:ring-gray-400 dark:bg-gray-800">
                        <span className="p-2">R$</span>
                        <input
                          type="number"
                          value={value[key]}
                          onChange={(e) =>
                            handleQuantityValueChange(
                              index,
                              key,
                              e.target.value,
                            )
                          }
                          className="border-none bg-transparent p-2 outline-none"
                        />
                      </div>
                    </div>
                  );
                })}

                {addingQuantity && (
                  <div className="mt-1 flex items-center justify-between gap-2 text-gray-700 dark:text-gray-200">
                    <input
                      className="rounded border bg-white p-2 text-sm font-semibold dark:bg-gray-800"
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const newKey = e.currentTarget.value;

                          if (
                            newKey &&
                            !formData?.quantityValues.some(
                              (value: any) => Object.keys(value)[0] === newKey,
                            )
                          ) {
                            setFormData((prev: any) => ({
                              ...prev,
                              quantityValues: [
                                ...(prev.quantityValues || []),
                                { [newKey]: 0 },
                              ],
                            }));
                            e.currentTarget.value = "";
                            setAddingQuantity(false);
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <section className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="mt-4 cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  onClick={() => {
                    setAddingQuantity(!addingQuantity);
                  }}
                >
                  +
                </button>

                <button
                  type="submit"
                  className="mt-4 w-full cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Salvar preferências
                </button>
              </section>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
