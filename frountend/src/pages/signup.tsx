import { useState } from "react";
import { Input, Button, Select, SelectItem, addToast } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import API from "@/config/API";

export default function Signup() {
    const [submitted, setSubmitted] = useState(false);
    

    const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("password") as string;
        const role = formData.get("role") as string;

        if(!role && role !== "0" && role !== "1") {
            addToast({
                title: "Invalid Role",
                description: "Please select a valid role.",
                color: "danger",
            });
            return;
        }

        const payload = {
            name,
            email,
            password,
            confirmPassword,
            role,
        };

        

        const xhr = new XMLHttpRequest();
        xhr.open("POST", API + "signup", true);
        xhr.setRequestHeader("Content-Type", "application/json"); // ✅ important
        let prom = new Promise((resolve, reject) => {
            xhr.onload = () => {
                console.log("Response:", xhr.responseText);
                if (xhr.status === 200) {
                    localStorage.setItem("token", JSON.parse(xhr.responseText).token);
                    setSubmitted(true);
                    resolve("Signup successful!");
                    addToast({
                        title: "Signup Successful",
                        description: "You can now log in.",
                        color: "success",
                    });
                } else {
                    console.error("Signup failed:", xhr.responseText);
                    reject("Signup failed: " + xhr.responseText);
                    addToast({
                        title: "Signup Failed",
                        description: "Please try again.",
                        color: "danger",
                    });
                }
            };
        })
        addToast({
            title: "Please Wait",
            description: "Connecting to server...",
            promise: prom,
            color: "default",
        });

        xhr.onerror = () => {
            console.error("Network error during signup");
        };

        xhr.send(JSON.stringify(payload)); // ✅ send JSON
    };

    return (
        <DefaultLayout>
            <div className="flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-semibold text-center">Create Account</h2>
                    <p className="text-center">Join us and get started</p>

                    {submitted ? (
                        <p className="text-green-600 text-center font-medium">
                            Signup successful! You can now log in.
                        </p>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <Input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                required
                            />
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
                            <Select required name="role" label="Select Role">
                                {["Job Seeker", "Hiring agent"].map((typ, index) => (
                                    <SelectItem key={index} textValue={typ}>
                                        {typ}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Button type="submit" color="primary" className="w-full">
                                Sign Up
                            </Button>
                        </form>
                    )}

                    <p className="text-sm text-center">
                        Already have an account?{" "}
                        <a href="/login" className="underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </DefaultLayout>
    );
}
