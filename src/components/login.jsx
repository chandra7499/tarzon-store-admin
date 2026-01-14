"use client";
import { useState, useEffect } from "react"; // Add useEffect
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAdminAuth,
  handleForgetPassword,
} from "@/functions/handleAdminAuth";
import { EyeClosed, Eye } from "lucide-react";
import { Spinner } from "./ui/spinner";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  const [Loading, setLoading] = useState(false);
  const [isForgetEnabled, setIsForgetEnabled] = useState(false);
  const [status, setStatus] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true); // Add loading state for auth check
  const [showPassword, setShowPassword] = useState(false);
  console.log("admin data", admin);

  // ✅ Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if admin_token exists
        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (data.authenticated && admin?.isAuthenticated) {
          router.push("/");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.log("Auth check error:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    // If already authenticated in Redux, redirect immediately
    if (admin?.isAuthenticated) {
      router.push("/");
    } else {
      checkAuth();
    }
  }, [admin?.isAuthenticated, router]);

  async function handleSubmit(e) {
    try {
      e.preventDefault(); // Add preventDefault
      setLoading(true);
      const statement = await handleAdminAuth(e, dispatch, router);
      if (statement) {
        setStatus(statement);
      }
    } catch (error) {
      console.log("error", error);
      setStatus(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function ForgetPasswordfn(e) {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      setLoading(true);
      const result = await handleForgetPassword(email);
      setStatus(result.message);
    } catch (error) {
      console.log(error);
      setStatus(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function showPasswordHandler() {
    setShowPassword(!showPassword);
  }

  // ✅ Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[url('/Gemini_Generated_Image_v6ogtav6ogtav6og.png')]">
        <div className="flex flex-col items-center gap-4 p-8 backdrop-blur-3xl bg-white/8 ring-1 ring-white/15 rounded-lg">
          <Spinner show={true} />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-screen w-full m-0 bg-[url('/Gemini_Generated_Image_v6ogtav6ogtav6og.png')] bg-cover bg-center">
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
        <section className="flex flex-col gap-3 w-full h-full justify-center items-center backdrop-blur-2xl">
          <form
            onSubmit={(e) =>
              !isForgetEnabled ? handleSubmit(e) : ForgetPasswordfn(e)
            }
            className="flex flex-col w-90 max-h-80 backdrop-blur-3xl bg-white/8 ring-1 lg:scale-[1.3] transition-all duration-500 ring-white/15 gap-3 p-4 rounded-lg"
          >
            <h1 className="text-2xl font-semibold mr-auto flex flex-col w-full justify-center items-center ml-auto mb-5">
              Welcome Back 👋🏻
              <p className="text-red-500 text-sm font-light">{status}</p>
            </h1>
            <div className="flex flex-col gap-5">
              <Input
                type="email"
                placeholder="Email"
                name="email"
                required
                disabled={Loading}
              />
              {!isForgetEnabled && (
                <div className="flex rounded-lg gap-3 justify-center items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    required
                    disabled={Loading}
                  />
                  {showPassword ? (
                    <EyeClosed
                      onClick={() => showPasswordHandler()}
                      className="cursor-pointer  transistion-all duration-100 ease-in-out"
                    />
                  ) : (
                    <Eye
                      onClick={() => showPasswordHandler()}
                      className="cursor-pointer transistion-all duration-100 ease-in-out"
                    />
                  )}
                </div>
              )}
            </div>
            <span
              onClick={() => !Loading && setIsForgetEnabled(!isForgetEnabled)}
              className={`${
                Loading
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/40 cursor-pointer hover:underline"
              } mr-0 ml-auto`}
            >
              {isForgetEnabled ? "Back to Login" : "Forgot password?"}
            </span>
            <div className="w-full">
              <Button
                type="submit"
                disabled={Loading}
                variant="outline"
                className="cursor-pointer flex w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Spinner show={Loading} />
                {isForgetEnabled ? "Send Reset Link" : "Login"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default Login;
