import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";

export const metadata = {
  title: "admin dashboard",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
