import ClientProviderWrapper from "../common/ClientProviderWrapper";
import Navbar from "./components/navbar/main/navbar";
import Container from "./components/Cards/ContainerCard";
import SiteFooter from "./components/footer/SiteFooter/SiteFooter";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import TrackVisitor from "./components/visitorsTrackUsers/TrackUniqueVisitorOnce";
import BackgroundAdWrapper from "./components/Advertisement/BackgroundAdWrapper";
import SideAds from "./components/Advertisement/SideAds";

export default function StoreFrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <ClientProviderWrapper>
        <Navbar />
        <BackgroundAdWrapper>
          <div className="min-h-screen">
            <Container>
              <TrackVisitor />
              {children}
            </Container>
            <SideAds />
          </div>
        </BackgroundAdWrapper>
        <SiteFooter />
      </ClientProviderWrapper>
    </ProtectedRoute>
  );
}
