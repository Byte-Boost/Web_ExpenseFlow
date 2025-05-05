import Swal from "sweetalert2";

export const successAlert = (text: string, log: string, cb: Function=()=>{}) : void =>{
    Swal.fire({
      title: 'Sucesso',
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: 1750,
      timerProgressBar: true,
    })
    console.log(log)
    cb()
  }

export const failureAlert = (text: string, log: string, cb:Function=()=>{}) : void =>{
    Swal.fire({
        title: 'Oops!',
        text: text,
        icon: 'error',
        showConfirmButton: false,
        timer: 1750,
    });
    console.log(log)
    cb()
}

export const confirmationAlert = (text:string, log: string, confirmCb:Function=()=>{}): void =>{
  Swal.fire({
    title: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText:"Não",
    confirmButtonText: "Sim",
    customClass: {
      popup: "!bg-white hover:!bg-gray-100 dark:!bg-gray-800 dark:hover:!bg-gray-700 !text-gray-900 dark:!text-white",
    }
  }).then((result) => {
    if (result.isConfirmed) {
      confirmCb()
    }
  });
  console.log(log)
}