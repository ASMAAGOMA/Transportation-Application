import React from 'react';
import { useScrollToElement } from '../hooks/useScrollToElement'; // Add this import
import { useGetPendingTripsQuery } from '../features/trips/tripsApiSlice'
import { 
  faCalendarDays, 
  faCar, 
  faClock, 
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import SidebarItem from './SidebarItem';
import Logo from './Logo';

const Sidebar = () => {
  const { data: pendingTrips } = useGetPendingTripsQuery();
  const pendingCount = pendingTrips?.ids?.length || 0;

  return (
    <aside className="w-20 bg-indigo-100 flex flex-col items-center py-4 fixed h-full">
      <div className="mb-4">
        <Logo image="/images/file.png" altText="Custom Logo" />
      </div>
      <nav className="flex flex-col gap-4">
      <SidebarItem 
        to="/pending" 
        icon={faClock} 
        label="Pending"
        badge={pendingCount > 0 ? pendingCount : undefined}
        active={location.pathname === '/pending'} 
      />
        <SidebarItem 
          to="/booking" 
          icon={faCalendarDays} 
          label="Booking" 
          active={location.pathname === '/booking'} 
        />
        <SidebarItem 
          to="/" 
          icon={faCar} 
          label="All Rides" 
          active={location.pathname === '/'} 
        />
        <SidebarItem 
          to="/upcoming" 
          icon={faClock} 
          label="Upcoming" 
          active={location.pathname === '/upcoming'} 
        />
        <SidebarItem 
          to="/profile" 
          icon={faUser} 
          label="My Profile" 
          active={location.pathname === '/profile'} 
        />
      </nav>
    </aside>
  );
};

export default Sidebar;