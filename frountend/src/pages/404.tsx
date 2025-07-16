// app/not-found.tsx (Next.js App Router compatible)

import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button"; // ya tumhare button component ka import path
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <DefaultLayout >
    <div className=" flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <p className="mb-6">Shayad tum galat mod par aa gaye ho. Chalo wapas ghar chalte hain.</p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
    </DefaultLayout>
  );
}
