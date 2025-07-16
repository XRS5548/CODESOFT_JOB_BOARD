
import DefaultLayout from "@/layouts/default";
import { Form, Input, Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const handleLogin = (formData: any) => {
        console.log("Login Data:", formData);
        // yahan login ka logic ya API call aayega
    };

    return (
        <DefaultLayout >
            <div className=" flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-semibold text-center">Welcome Back 👋</h2>
                    <p className="text-center">Login to your account</p>

                    <Form onSubmit={handleLogin} className="space-y-4">
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
                    </Form>

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
