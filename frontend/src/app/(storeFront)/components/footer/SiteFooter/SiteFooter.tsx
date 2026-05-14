import Footer from "../footer";
import SubFooter from "../subfooter";

export default function SiteFooter() {
  return (
    <div id="site-footer" className="mt-auto mx-auto w-full bg-white relative z-30">
      <SubFooter />
      <Footer />
    </div>
  );
}
