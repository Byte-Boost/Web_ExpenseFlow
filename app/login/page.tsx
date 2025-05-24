'use client';
import { NavBar } from "@/app/modules/navbar/index";
import { useState } from "react";
import { sendLogin } from "../utils/endpoints";
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { failureAlert } from "../utils/alerts";


export default function Home() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  
  const login = async (username:string , password:string) => {
    try {
      let res = await sendLogin(username, password);
      const token = res.token;
      if (jwtDecode<{admin: boolean}>(token).admin === true){
        setCookie('token', token);
        router.push('/');
      } else {
        throw new Error("User is not an admin");
      };
    } catch{
      failureAlert("Invalid Credentials", "User does not exist or lacks permissions");
      setUsernameInput("");
      setPasswordInput("");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <NavBar></NavBar>
      <div className="flex flex-col grow items-center justify-around py-2">
            <section className="flex flex-col items-center justify-center p-8 min-w-lg rounded-xl border bg-white border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Login
                </h1>
                <form className="mt-4 space-y-4 w-full max-w-xl" 
                    onSubmit={(e) => {
                        e.preventDefault()
                        login(usernameInput, passwordInput)
                    }}
                >

                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-200">Email</label>
                      <input
                          name="username"
                          type="text"
                          value={usernameInput}
                          onChange={(e)=> setUsernameInput(e.target.value)}
                          className="p-2 w-full flex mt-1 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 dark:text-gray-200">Senha</label>
                      <input
                          name="password"
                          type="password"
                          value={passwordInput}
                          onChange={(e)=> setPasswordInput(e.target.value)}
                          className="p-2 w-full flex mt-1 rounded border text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-400"
                      />
                    </div>

                    <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer">
                        Login
                    </button>
                </form>
            </section>
        </div>
    </main>
  );
}
