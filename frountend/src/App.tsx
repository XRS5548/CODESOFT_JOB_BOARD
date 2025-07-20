import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import ApplyJob from "@/pages/ApplyJob";
import SeekerDashboard from "@/pages/seekerdahboard";
import PosterDashboard from "./pages/posterdashboard";
import NotFound from "./pages/404";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import JobDetailsPage from "./pages/JobDetailsPage";
import { useEffect } from "react";

function App() {
 
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<ApplyJob />} path="/apply/:id" />
      {localStorage.getItem("token") && (<>
        <Route element={<SeekerDashboard />} path="/user" />
        <Route element={<PosterDashboard />} path="/hr" />
      </>
      )}

      {/* Public Routes */}
      <Route element={<LoginPage />} path="/login" />
      <Route element={<Signup />} path="/register" />
      <Route element={<JobDetailsPage />} path="/jobs/:id" />


      <Route element={<NotFound />} path="*" />



    </Routes>
  );
}

export default App;
