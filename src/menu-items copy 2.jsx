// assets/icons.js
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'; // Added
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'; // Added

export const icons = {
  NavigationOutlinedIcon,
  DashboardOutlinedIcon,
  WifiOutlinedIcon,
  ChromeReaderModeOutlinedIcon,
  AppRegistrationOutlinedIcon,
  CategoryOutlinedIcon,
  PeopleAltOutlinedIcon,
  PersonAddAlt1OutlinedIcon,
  AppsOutlinedIcon,
  ReportProblemOutlinedIcon,
  HourglassEmptyOutlinedIcon,
  HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon,
  InsightsOutlinedIcon,
  ListAltOutlinedIcon,
  CreditCardOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //
const menuConfig = {
  items: [
    {
      id: 'navigation',
      title: 'RK Electronics',
      caption: 'Dashboard & Profile',
      type: 'group',
      icon: icons.NavigationOutlinedIcon,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons.DashboardOutlinedIcon,
          url: '/'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages & Management',
      type: 'group',
      icon: icons.NavigationOutlinedIcon,
      children: [
        {
          id: 'stores-management',
          title: 'Store Management',
          type: 'collapse',
          icon: icons.WifiOutlinedIcon,
          children: [
            {
              id: 'viewall-stores',
              title: 'View All Stores',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/stores'
            }
          ]
        },
        {
          id: 'Sales-management',
          title: 'Sales Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'sales-dashboard',
              title: 'Sales Dashboard',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/sales'
            }
          ]
        },
        {
          id: 'coupons-management',
          title: 'Coupons Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'all-coupons',
              title: 'All Coupons',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/coupons'
            }
          ]
        },

        {
          id: 'customer-management',
          title: 'Customer Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'all-customers',
              title: 'All Customers',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/users'
            }
          ]
        },
        {
          id: 'product-management',
          title: 'Product Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'all-products',
              title: 'All Products',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/products'
            },
            {
              id: 'add-product',
              title: 'Add Product',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/addproduct'
            }
          ]
        },
        {
          id: 'location-management',
          title: 'Location Management',
          type: 'collapse',
          icon: icons.ChromeReaderModeOutlinedIcon,
          children: [
            {
              id: 'locations',
              title: 'All Locations',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/locations'
            }
          ]
        },
        {
          id: 'staff-management',
          title: 'Staff Management',
          type: 'collapse',
          icon: icons.ChromeReaderModeOutlinedIcon,
          children: [
            {
              id: 'all-staff',
              title: 'All Staff',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/staff'
            }
          ]
        }
      ]
    },
    {
      id: 'utils',
      title: 'Utils',
      type: 'group',
      icon: icons.SecurityOutlinedIcon,
      children: [
        {
          id: 'util-icons',
          title: 'Icons',
          type: 'item',
          icon: icons.InsightsOutlinedIcon,
          external: true
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: icons.HelpOutlineOutlinedIcon,
      children: [
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: icons.HelpOutlineOutlinedIcon,
          external: true
        }
      ]
    }
  ]
};

export default menuConfig;
