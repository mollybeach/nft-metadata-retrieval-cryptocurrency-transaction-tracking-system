/**
 * App
 * @path src/App.jsx
 * @description The main component for the application.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserCircle, LayoutDashboard } from 'lucide-react';

import Home from './pages/Home.jsx';
import Detailed from './pages/Detailed.jsx';
import Trading from './pages/Trading.jsx';
import NFTData from './pages/NFTData';
import TransactionTracker from './pages/TransactionTracker';
import Sidebar, { SidebarItem } from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar>
          <SidebarItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            text="Home"
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Trading"
            to="/Trading"
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="NFT Metadata"
            to="/nft-metadata"
          />
          <SidebarItem
            icon={<UserCircle size={20} />}
            text="Transaction Tracker"
            to="/transaction-tracker"
          />
          <hr className="my-3" />
        </Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page/:pageNumber" element={<Home />} />
          <Route path="/categories" element={<Home />} />
          <Route path="/Trading" element={<Trading />} />
          <Route path="/nft-metadata" element={<NFTData />} />
          <Route path="/transaction-tracker" element={<TransactionTracker />} />
          <Route path="/:id" element={<Detailed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
