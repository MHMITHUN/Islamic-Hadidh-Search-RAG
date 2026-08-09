import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import GradePage from "./pages/GradePage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import HadithDetail from "./pages/HadithDetail.jsx";
import Verify from "./pages/Verify.jsx";
import About from "./pages/About.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="collection/:name" element={<CollectionPage />} />
          <Route path="grade/:grade" element={<GradePage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="hadith/:id" element={<HadithDetail />} />
          <Route path="verify" element={<Verify />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
