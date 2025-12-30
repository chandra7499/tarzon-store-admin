"use client";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleAdminAuth,handleForgetPassword } from "@/functions/handleAdminAuth";
import { Spinner } from "./ui/spinner";

const login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const [Loading, setLoading] = useState(false);
  const [isForgetEnabled, setIsForgetEnabled] = useState(false);
  const [status,setStatus] = useState("");
  console.log("admin data", admin);

  async function handleSubmit(e) {
    try {
      setLoading(true);
      const statement = await handleAdminAuth(e, dispatch, router);
      setStatus(statement);
    } catch (error) {
      console.log("error", error);
      setStatus(error);
    } finally {
      setLoading(false);
    }
  }

  async function ForgetPasswordfn(e){
    e.preventDefault();
    const email = e.target.email.value;
    try {
      setLoading(true);
      const status = await handleForgetPassword(email);
      setStatus(status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }



  return (
    <>
      <main className="flex h-full w-full m-0  bg-[url('/Gemini_Generated_Image_v6ogtav6ogtav6og.png')] ">
        <section className="lg:h-full lg:w-full lg:flex hidden">
          <Image
            src="/Gemini_Generated_Image_v6ogtav6ogtav6og (1).png"
            alt="logo"
            width={1000}
            height={800}
            priority
            className="w-full h-full object-fill"
          />
        </section>
        <section className="flex flex-col gap-3 w-full h-full  justify-center items-center backdrop-blur-2xl">
          <form
            onSubmit={(e) => !isForgetEnabled ? handleSubmit(e) : ForgetPasswordfn(e)}
            className="flex flex-col w-90 max-h-80    backdrop-blur-3xl bg-white/8 ring-1  lg:scale-[1.3] transition-all duration-500  ring-white/15 gap-3  p-4 rounded-lg"
          >
            <h1 className="text-2xl font-semibold mr-auto flex flex-col w-full  justify-center items-center ml-auto mb-5">
              Welcome Back 👋🏻
            <p className="text-red-500 text-sm font-light">{status}</p>
            </h1>
            <div className="flex flex-col gap-5 ">
              <Input type="email" placeholder="Email" name="email" required />
              {!isForgetEnabled && <Input
                type="password"
                placeholder="password"
                name="password"
                required
              />}
            </div>
            <span onClick={()=>setIsForgetEnabled(!isForgetEnabled)} className="text-white/40 cursor-pointer hover:underline mr-0 ml-auto">
              {isForgetEnabled ? "Login" : "Forget password"}
            </span>
            <div className="w-full">
              <Button
                type="submit"
                disabled={Loading}
                variant="outline"
                className="cursor-pointer flex w-full disabled:cursor-not-allowed"
              >
                <Spinner show={Loading} />
                  {isForgetEnabled ? "Send-Link" : "Login"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default login;
