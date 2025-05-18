'use client';
import { NavBar } from "@/app/modules/navbar/index";
import { getProject, updatePreference } from "@/app/utils/endpoints";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

export default function Home() {
    const params = useParams();
    const projectId = Number(params.projectId);
    const [addingQuantity, setAddingQuantity] = useState(false);
    const [project, setProject] = useState<Project|null>(null);
    const [formData, setFormData] = useState<ProjectPreference>({
        refundLimit: 0,
        expenseLimit: 0,
        quantityValues: []
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({
          ...prev,
          [name]: parseFloat(value)
        }))
    }
    const handleQuantityValueChange = (index: any, key: any, value: any) => {
        const updated = [...(formData?.quantityValues || [])]
        updated[index][key] = parseFloat(value)
        setFormData((prev: any) => ({
            ...prev,
            quantityValues: updated
        }))
    }
    const removeQuantityValue = (key:any) =>{
        const updated = [...(formData?.quantityValues || [])]
        const index = updated.findIndex((value: any) => Object.keys(value)[0] === key)
        if (index !== -1) {
            updated.splice(index, 1)
            setFormData((prev: any) => ({
                ...prev,
                quantityValues: updated
            }))
        }
    }
    async function updateProjectPreferences(preference: ProjectPreference) {
        const response: any = await updatePreference(projectId, preference);
        return response;
    };

    useEffect(() => {
        const fetchProject = async () => {
            const response = await getProject(projectId);
            setProject(response);
            if (response.preferences) setFormData(response.preferences);
        };
        fetchProject();
    }, [])

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <NavBar></NavBar>
        <div className="flex flex-col grow items-center justify-around py-2">
            <section className="flex flex-col items-center justify-center p-8 min-w-lg rounded-xl border bg-white border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">#{projectId} - {project?.name}</h1>
                <form className="mt-4 space-y-4 w-full max-w-xl" 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault()
                    }}
                    onSubmit={(e) => {
                        e.preventDefault()
                        updateProjectPreferences(formData as ProjectPreference).then((response) => {
                            console.log(response)
                        })
                    }}
                >
                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-200">Refund Limit</label>
                        <div className="w-full flex mt-1 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-400">
                            <span className="p-2">R$</span>
                            <input
                                name="refundLimit"
                                type="number"
                                value={formData?.refundLimit}
                                onChange={handleInputChange}
                                className="p-2 grow outline-none border-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-200">Expense Limit</label>
                        <div className="w-full flex mt-1 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-400">
                            <span className="p-2">R$</span>
                            <input
                                name="expenseLimit"
                                type="number"
                                value={formData?.expenseLimit}
                                onChange={handleInputChange}
                                className="p-2 grow outline-none border-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 dark:text-gray-200">Quantity Values</label>
                        {formData?.quantityValues.map((value, index) => {
                            const key = Object.keys(value)[0]
                            return (
                            <div key={index} className="flex justify-between items-center gap-2 mt-1 text-gray-700 dark:text-gray-200 ">
                                <span>
                                    <button type="button" className="font-bold bg-red-600 hover:bg-red-700 py-0 px-4 text-white rounded cursor-pointer" onClick={()=>{
                                        removeQuantityValue(key);
                                    }}>
                                        -
                                    </button>
                                    <span className="ml-2 text-sm font-semibold">{key}</span>
                                </span>
                                
                                <div className="max-w-3xl rounded border bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-400">
                                    <span className="p-2">R$</span>
                                    <input
                                    type="number"
                                    value={value[key]}
                                    onChange={(e) => handleQuantityValueChange(index, key, e.target.value)}
                                    className="p-2 outline-none border-none bg-transparent"
                                    />
                                </div>
                            </div>
                            )
                        })}

                        { addingQuantity && (
                            <div className="flex justify-between items-center gap-2 mt-1 text-gray-700 dark:text-gray-200">
                                <input className="text-sm font-semibold p-2 rounded border bg-white dark:bg-gray-800" type="text" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const newKey = e.currentTarget.value

                                        if (newKey && !formData?.quantityValues.some((value: any) => Object.keys(value)[0] === newKey)) {
                                            setFormData((prev: any) => ({
                                                ...prev,
                                                quantityValues: [...(prev.quantityValues || []), {[newKey]: 0}]
                                            }));
                                            e.currentTarget.value = '';
                                            setAddingQuantity(false);
                                        }
                                    }
                                }}/>
                            </div>
                        )}
                    </div>

                    <section className="flex gap-3 items-center justify-center mt-4">
                        <button type="button" className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 cursor-pointer" onClick={()=>{
                            setAddingQuantity(!addingQuantity);
                        }}>
                            +
                        </button>

                        <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer">
                            Save Preferences
                        </button>
                    </section>
                </form>
            </section>
        </div>
    </main>
  );
}
