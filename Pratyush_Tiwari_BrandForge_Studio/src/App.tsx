import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import { StudioProvider } from './components/StudioContext';
import Home from './pages/Home';
import Create from './pages/Create';
import Generate from './pages/Generate';
import Editor from './pages/Editor';
import BrandKit from './pages/BrandKit';
import Dashboard from './pages/Dashboard';
import AboutCG from './pages/AboutCG';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <StudioProvider>
      <HashRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/brand-kit" element={<BrandKit />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutCG />} />
          <Route
            path="*"
            element={
              <main className="empty-state">
                <h1>This page is off the artboard.</h1>
                <Link className="btn btn-primary" to="/">
                  Back to the studio
                </Link>
              </main>
            }
          />
        </Routes>
      </HashRouter>
    </StudioProvider>
  );
}
