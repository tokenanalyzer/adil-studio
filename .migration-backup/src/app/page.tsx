import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";
import {
  getActiveGoals,
  getActiveIndustries,
  getAllPublishedVariants,
  getPublishedServices,
  getFeaturedPortfolio,
  getSiteSettings,
} from "@/lib/cms/public";

export default async function HomePage() {
  const [goals, industries, variants, services, portfolio, settings] =
    await Promise.all([
      getActiveGoals(),
      getActiveIndustries(),
      getAllPublishedVariants(),
      getPublishedServices(),
      getFeaturedPortfolio(),
      getSiteSettings(),
    ]);

  return (
    <>
      <Nav />
      <HomeClient
        goals={goals}
        industries={industries}
        variants={variants}
        services={services}
        portfolio={portfolio}
        settings={settings}
      />
      <Footer
        siteName={settings?.site_name}
        siteTagline={settings?.site_tagline}
        contactEmail={settings?.contact_email}
      />
    </>
  );
}
