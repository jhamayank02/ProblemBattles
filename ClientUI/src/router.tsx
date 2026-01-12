import { Route } from "react-router";
import Login from "./auth/login";
import Signup from "./auth/signup";
import AuthLayout from "./auth/auth-layout";
import SiteLayout from "./app/site-layout";
import Home from "./app/home";
import ProblemPage from "./app/problem-page";
import AdminLayout from "./app/admin/admin-layout";
import AdminCompaniesPage from "./app/admin/companies";
import AdminProblemsPage from "./app/admin/problems";
import AdminProblemPage from "./app/admin/problem";
import UserRoute from "./components/user-route";
import AdminRoute from "./components/admin-route";

export default [
    <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="signup" element={<Signup />} />
    </Route>,
        <Route path="/" element={<UserRoute><SiteLayout /></UserRoute>}>
            <Route index element={<Home />} />
            <Route path="problem/:problemId" element={<ProblemPage />} />
        </Route>,
    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminProblemsPage />} />
        <Route path="company" element={<AdminCompaniesPage />} />
        <Route path="problem" element={<AdminProblemPage />} />
    </Route>
]