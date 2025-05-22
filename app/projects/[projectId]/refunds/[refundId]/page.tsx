"use client";
import { NavBar } from "@/app/modules/navbar/index";
import {
  authorizeRefund,
  getExpenseById,
  getRefundById,
} from "@/app/utils/endpoints";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Spinner,
} from "flowbite-react";
import { failureAlert, successAlert } from "@/app/utils/alerts";
import { FaTimes } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.projectId);
  const refundId = Number(params.refundId);
  const [showModal, setShowModal] = useState(null);
  const [refund, setRefund] = useState<any | null>(null);
  const [expenses, setExpenses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function processRefund(authorize: boolean) {
    const response: any = await authorizeRefund(refundId, authorize);
    return response;
  }

  useEffect(() => {
    const fetchRefund = async () => {
      const response = await getRefundById(refundId);
      setIsLoading(false);
      setRefund(response);
      response.Expenses.forEach(async (ex: any) => {
        const responseExpenses = await getExpenseById(ex.id);
        setExpenses((prev: any) => [...prev, responseExpenses]);
      });
    };
    fetchRefund();
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(null);
      }
    };

    if (showModal != null) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <NavBar></NavBar>
      <div className="mt-20 flex grow flex-col items-center justify-start py-2">
        {isLoading && <Spinner color="purple" className="m-20 scale-200" />}
        {refund && !isLoading && (
          <div className="mx-auto mb-4 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            {/* Header */}
            <div className="mb-1 flex items-start justify-between text-gray-900 dark:text-white">
              <span className="text-4xl">
                <span className="mr-8 text-gray-800 dark:text-gray-400">
                  #{refund.id}
                </span>
                <span>R${refund.totalValue.toFixed(2)}</span>
              </span>
              <span
                className={
                  "rounded-full px-2 py-0.5 text-xs " + badges["default"]
                }
              >
                {refund.Project.name}
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              {new Date(refund.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              •{" "}
              {new Date(refund.date).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
              GMT-3
            </p>

            {/* Details */}
            <div className="grid grid-cols-[9ch_1fr] gap-x-3 gap-y-1 text-sm">
              <span className="font-medium">Solicitante:</span>
              <span>{refund.User.email}</span>

              <span className="font-medium">Status:</span>
              <span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${badges[refund.status as keyof typeof badges] || "default"}`}
                >
                  {refund.status}
                </span>
              </span>
            </div>

            {/* Expenses */}
            <Accordion collapseAll className="mt-4">
              {expenses.map((exp: any, ind: any) => (
                <AccordionPanel key={exp.id}>
                  <AccordionTitle className="cursor-pointer">
                    R${exp.value.toFixed(2)}
                  </AccordionTitle>

                  <AccordionContent>
                    <div className="space-y-3 text-sm text-gray-800 dark:text-gray-300">
                      {/* date */}
                      <div className="flex justify-between">
                        <span className="font-medium">Data</span>
                        <span>{new Date(exp.date).toLocaleDateString()}</span>
                      </div>

                      {/* type */}
                      <div className="flex justify-between">
                        <span className="font-medium">Tipo</span>
                        <span className="capitalize">{exp.type}</span>
                      </div>

                      {/* quantity type */}
                      {exp.type === "quantity" && (
                        <div className="flex justify-between">
                          <span className="font-medium">Tipo de quantidade</span>
                          <span>{exp.quantityType}</span>
                        </div>
                      )}

                      {/* value */}
                      <div className="flex justify-between">
                        <span className="font-medium">Valor</span>
                        <span className="font-semibold">
                          R$ {exp.value.toFixed(2)}
                        </span>
                      </div>

                      {/* description */}
                      {exp.description && (
                        <div>
                          <p className="font-medium">Descrição</p>
                          <p className="whitespace-pre-line text-gray-600">
                            {exp.description}
                          </p>
                        </div>
                      )}

                      {/* attachments (TBD) */}
                      {exp.attachment && (
                        <div>
                          <p className="mb-1 font-medium">Anexo</p>
                          <img
                            src={exp.attachment}
                            alt="expense proof"
                            onClick={() => {
                              setShowModal(ind);
                            }}
                            className="max-h-56 w-full cursor-pointer rounded border object-cover"
                          />
                          {showModal == ind && (
                            <div
                              onClick={() => setShowModal(null)}
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-all duration-200 dark:bg-gray-900/80"
                            >
                              <button
                                onClick={() => setShowModal(null)}
                                className="absolute top-8 right-8 cursor-pointer text-2xl text-white hover:text-red-400"
                                aria-label="Close"
                              >
                                <FaTimes />
                              </button>
                              <img
                                src={exp.attachment}
                                alt="Full Size"
                                className="max-h-[90%] max-w-[90%] object-contain"
                              />
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
            {refund.status === "in-process" && (
              <section className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="mt-4 w-full cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  onClick={() => {
                    processRefund(false)
                      .then((res: any) => {
                        successAlert(
                          "Reembolso reprovado",
                          "Refund rejected successfully.",
                        );
                        router.push("/projects/" + projectId + "/refunds");
                      })
                      .catch((err: any) => {
                        failureAlert(
                          "Erro ao reprovado reembolso",
                          "An error occured while trying to reject the refund.",
                        );
                      });
                  }}
                >
                  Reprovar
                </button>

                <button
                  type="button"
                  className="mt-4 w-full cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  onClick={() => {
                    processRefund(true)
                      .then((res: any) => {
                        successAlert(
                          "Reembolso aprovado",
                          "Refund approved successfully.",
                        );
                        router.push("/projects/" + projectId + "/refunds");
                      })
                      .catch((err: any) => {
                        failureAlert(
                          "Erro ao aprovar reembolso",
                          "An error occured while trying to approve the refund.",
                        );
                      });
                  }}
                >
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
