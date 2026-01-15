import {
  FaThLarge,
  FaStore,
  FaHome,
  FaCar,
  FaShip,
  FaMotorcycle,
  FaTractor,
  FaStar,
  FaList,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaCogs,
} from 'react-icons/fa'

const linksForManagment = [
  { id: 'marketplace', name: 'Marketplace', href: '/dashboard/managment/marketplace', icon: FaStore },
  { id: 'real-estate', name: 'Real Estate', href: '/dashboard/managment/real-estate', icon: FaHome },
  { id: 'cars', name: 'Cars', href: '/dashboard/managment/cars', icon: FaCar },
  { id: 'boats', name: 'Boats', href: '/dashboard/managment/boats', icon: FaShip },
  { id: 'motorcycles', name: 'Motorcycles', href: '/dashboard/managment/motorcycles', icon: FaMotorcycle },
  { id: 'traktor', name: 'Traktor', href: '/dashboard/managment/traktor', icon: FaTractor },
  { id: 'featured', name: 'Featured', href: '/dashboard/managment/featured', icon: FaStar },
  { id: 'listings', name: 'All Listings', href: '/dashboard/managment/listings', icon: FaList },
  { id: 'users', name: 'Users', href: '/dashboard/managment/users', icon: FaUsers },
  { id: 'content', name: 'Content', href: '/dashboard/managment/content', icon: FaFileAlt },
  // analytics removed
  { id: 'operations', name: 'Operations', href: '/dashboard/managment/operations', icon: FaCogs },
  { id: 'overview', name: 'Overview', href: '/dashboard/managment', icon: FaThLarge },
]

export default linksForManagment
