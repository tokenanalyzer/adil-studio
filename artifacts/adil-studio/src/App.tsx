import { Switch, Route, Router as WouterRouter } from "wouter";
import HomePage from "@/pages/HomePage";
import ContactPage from "@/pages/ContactPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminGoalsPage from "@/pages/admin/AdminGoalsPage";
import AdminIndustriesPage from "@/pages/admin/AdminIndustriesPage";
import AdminLeadsPage from "@/pages/admin/AdminLeadsPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import AdminPortfolioPage from "@/pages/admin/AdminPortfolioPage";
import AdminVariantsPage from "@/pages/admin/AdminVariantsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import StudioVariantPage from "@/pages/StudioVariantPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminLayout from "@/layouts/AdminLayout";

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/studio/:goal/:industry" component={StudioVariantPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin">
        <AdminRoute><AdminDashboardPage /></AdminRoute>
      </Route>
      <Route path="/admin/goals">
        <AdminRoute><AdminGoalsPage /></AdminRoute>
      </Route>
      <Route path="/admin/industries">
        <AdminRoute><AdminIndustriesPage /></AdminRoute>
      </Route>
      <Route path="/admin/leads">
        <AdminRoute><AdminLeadsPage /></AdminRoute>
      </Route>
      <Route path="/admin/services">
        <AdminRoute><AdminServicesPage /></AdminRoute>
      </Route>
      <Route path="/admin/portfolio">
        <AdminRoute><AdminPortfolioPage /></AdminRoute>
      </Route>
      <Route path="/admin/variants">
        <AdminRoute><AdminVariantsPage /></AdminRoute>
      </Route>
      <Route path="/admin/settings">
        <AdminRoute><AdminSettingsPage /></AdminRoute>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
