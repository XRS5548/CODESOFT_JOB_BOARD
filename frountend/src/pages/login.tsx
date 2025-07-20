import DefaultLayout from "@/layouts/default";
import { Input, Button, addToast } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "@/config/API";

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const payload = { email, password };

        try {
            if (!email || !password) {
                setError("❌ Please fill all fields.");
                return;
            }
            let prom = new Promise(async (resolve, reject) => {
                const res = await fetch(API + "signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();

                if (res.ok && data.token) {
                    localStorage.setItem("token", data.token);
                    navigate("/"); // ✅ change route on login success
                    addToast({
                        title: "Login Successful",
                        description: "Welcome back!",
                        color: "success",
                        endContent: (
                            <Button
                                variant="flat"
                                onClick={() => window.location.replace("/")}
                            >
                                Reload Website
                            </Button>
                        ),
                    });
                    resolve("Login successful!");
                } else {
                    setError(data.message || "Login failed");
                    console.error("Login error:", data);
                    addToast({
                        title: "Login Failed",
                        description: data.message || "Please try again.",
                        color: "danger",
                    });
                    reject(data.message || "Login failed");
                }
            })
            addToast({
                title: "Logging ....",
                description: "Please wait while we log you in.",
                color: "primary",
                promise: prom,
            });

        } catch (err) {
            console.error("Network error:", err);
            addToast({
                title: "Network Error",
                description: "Please check your connection and try again.",
                color: "danger",
            });
            setError("Something went wrong");
        }
    };

    return (
        <DefaultLayout>
            <div className="flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-semibold text-center">Welcome Back 👋</h2>
                    <p className="text-center">Login to your account</p>

                    {error && (
                        <p className="text-red-600 text-center font-medium">{error}</p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>

                    <p className="text-sm text-center">
                        Do not have an account?{" "}
                        <Link to="/register" className="underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </DefaultLayout>
    );
}
