'use client';
import { NavBar } from "@/app/modules/navbar/index";
import { authorizeRefund, getExpenseById, getRefundById } from "@/app/utils/endpoints";
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { failureAlert, successAlert } from "@/app/utils/alerts";
import { FaTimes } from 'react-icons/fa';

export default function Home() {
    const router = useRouter();
    const params = useParams();
    const projectId = Number(params.projectId);
    const refundId = Number(params.refundId);
    const [showModal, setShowModal] = useState(null);
    const [refund, setRefund] = useState<any|null>(null);
    const [expenses, setExpenses] = useState<any>([]);
    
    async function processRefund(authorize: boolean) {
        const response: any = await authorizeRefund(refundId, authorize);
        return response;
    };

    useEffect(() => {
        const fetchRefund = async () => {
            const response = await getRefundById(refundId);
            setRefund(response);
            response.Expenses.forEach(async (ex:any)=>{
                const responseExpenses = await getExpenseById(ex.id);
                setExpenses((prev:any) => [...prev, responseExpenses]);
            })
        };
        fetchRefund();
    }, [])

    let badges = {
        "default": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        "new": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        "rejected": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        "approved": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        "in-process": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowModal(null);
            }
        };

        if (showModal!=null) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModal]);

    return (
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <NavBar></NavBar>
            <div className="flex flex-col grow items-center justify-start mt-20 py-2">
                { refund && (
                <div className="w-full max-w-lg mx-auto rounded-lg border shadow-sm p-6 bg-white border-gray-200  dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white mb-4">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-1 text-gray-900 dark:text-white">
                        <span className="text-4xl">
                            <span className="text-gray-800 dark:text-gray-400 mr-8">#{refund.id}</span>
                            <span>R${refund.totalValue.toFixed(2)}</span>
                        </span>
                        <span className={"text-xs px-2 py-0.5 rounded-full " + badges["default"]}>{refund.Project.name}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        {new Date(refund.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })} •
                        {' '}
                        {new Date(refund.date).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', hour12:false })}
                        {' '}
                        GMT-3
                    </p>

                    {/* Details */}
                    <div className="grid grid-cols-[9ch_1fr] gap-y-1 gap-x-3 text-sm">
                        <span className="font-medium">Solicitante:</span>
                        <span>{refund.User.email}</span>

                        <span className="font-medium">Status:</span>
                        <span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badges[refund.status as keyof typeof badges] || "default"}`}>
                                {refund.status}
                            </span>
                        </span>
                    </div>

                    {/* Expenses */}
                    <Accordion collapseAll className="mt-4">
                        {expenses.map((exp:any, ind:any) => (
                            <AccordionPanel key={exp.id} >
                                <AccordionTitle className="cursor-pointer">
                                    R${exp.value.toFixed(2)}
                                </AccordionTitle>

                                <AccordionContent>
                                    <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">

                                        {/* date */}
                                        <div className="flex justify-between">
                                            <span className="font-medium">Date</span>
                                            <span>{new Date(exp.date).toLocaleDateString()}</span>
                                        </div>

                                        {/* type */}
                                        <div className="flex justify-between">
                                            <span className="font-medium">Type</span>
                                            <span className="capitalize">{exp.type}</span>
                                        </div>

                                        {/* quantity type */}
                                        {exp.type === 'quantity' && (
                                            <div className="flex justify-between">
                                            <span className="font-medium">Quantity type</span>
                                            <span>{exp.quantityType}</span>
                                            </div>
                                        )}

                                        {/* value */}
                                        <div className="flex justify-between">
                                            <span className="font-medium">Value</span>
                                            <span className="font-semibold">
                                            R$ {exp.value.toFixed(2)}
                                            </span>
                                        </div>

                                        {/* description */}
                                        {exp.description && (
                                            <div>
                                            <p className="font-medium">Description</p>
                                            <p className="whitespace-pre-line text-gray-600">
                                                {exp.description}
                                            </p>
                                            </div>
                                        )}

                                        {/* attachments (TBD) */}
                                        {exp.attachment && (
                                            <div>
                                            <p className="font-medium mb-1">Attachment</p>
                                            <img
                                                src={exp.attachment}
                                                alt="expense proof"
                                                onClick={()=>{setShowModal(ind)}}
                                                className="w-full max-h-56 object-cover rounded border cursor-pointer"
                                            />
                                            {showModal==ind && (
                                                <div
                                                onClick={() => setShowModal(null)}
                                                className="fixed inset-0 bg-black/80 dark:bg-gray-900/80 flex items-center justify-center z-50 transition-all duration-200"
                                                >
                                                    <button
                                                        onClick={() => setShowModal(null)}
                                                        className="absolute top-8 right-8 text-white text-2xl hover:text-red-400 cursor-pointer"
                                                        aria-label="Close"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                    <img src={exp.attachment} alt="Full Size" className="max-w-[90%] max-h-[90%] object-contain" />
                                                </div>
                                            )}
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>
                        ))}
                    </Accordion>

                    {/* Approve/Reject */}
                    { refund.status === "in-process" && (
                        <section className="flex gap-3 items-center justify-center mt-4">
                            <button type="button" className="mt-4 w-full py-2 px-4 rounded cursor-pointer text-white bg-red-600 hover:bg-red-700" onClick={()=>{
                                processRefund(false).then((res:any)=>{
                                    successAlert("Reembolso reprovado", "Refund rejected successfully.");
                                    router.push("/projects/"+projectId+"/refunds");

                                }).catch((err:any)=>{
                                    failureAlert("Erro ao reprovado reembolso", "An error occured while trying to reject the refund.");
                                });
                            }}>
                                Reprovar
                            </button>

                            <button type="button" className="mt-4 w-full py-2 px-4 rounded cursor-pointer text-white bg-green-600 hover:bg-green-700" onClick={()=>{
                                processRefund(true).then((res:any)=>{
                                    successAlert("Reembolso aprovado", "Refund approved successfully.");
                                    router.push("/projects/"+projectId+"/refunds");
                                }).catch((err:any)=>{
                                    failureAlert("Erro ao aprovar reembolso", "An error occured while trying to approve the refund.");
                                });
                            }}>
                                Aprovar
                            </button>
                        </section>
                    )}
                </div>
                )}
            </div>
        </main>
    );
}
