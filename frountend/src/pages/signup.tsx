import { useState } from "react";
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import DefaultLayout from "@/layouts/default";

export default function Signup() {
    const [submitted, setSubmitted] = useState(false);

    const handleSignup = (formData: any) => {
        console.log("Signup Data:", formData);
        setSubmitted(true);
        // Yahan API call ya backend logic aa sakta hai
    };

    return (
        <DefaultLayout >
            <div className=" flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-semibold text-center">Create Account</h2>
                    <p className="text-center">Join us and get started</p>

                    {submitted ? (
                        <p className="text-green-600 text-center font-medium">
                            Signup successful! You can now log in.
                        </p>
                    ) : (
                        <Form onSubmit={handleSignup} className="space-y-4">
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
                            <Select name="role" label="Select Role">
                                {['Job Seeker','Hiring agent'].map((typ,index) => (
                                    <SelectItem key={index}>{typ}</SelectItem>
                                ))}
                            </Select>
                            <Button type="submit" color="primary" className="w-full">
                                Sign Up
                            </Button>
                        </Form>
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
