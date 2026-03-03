// import { icons } from './assets/icons';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export const icons = {
  NavigationOutlinedIcon,
  DashboardOutlinedIcon,
  StorefrontOutlinedIcon, // Better for Store Management
  ChromeReaderModeOutlinedIcon,
  AppRegistrationOutlinedIcon,
  CategoryOutlinedIcon,
  PeopleAltOutlinedIcon,
  PersonAddAlt1OutlinedIcon,
  AppsOutlinedIcon,
  ReportProblemOutlinedIcon,
  HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon,
  InsightsOutlinedIcon,
  ListAltOutlinedIcon,
  ReceiptLongOutlinedIcon, // Better for Sales
  LocalOfferOutlinedIcon, // Better for Coupons
  BadgeOutlinedIcon, // Better for Staff
  LocationOnOutlinedIcon, // Better for Locations
  Inventory2OutlinedIcon // Better for Products
};

const menuConfig = {
  items: [
    {
      id: 'navigation',
      title: 'RK Electronics',
      caption: 'Dashboard & Profile',
      type: 'group',
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
      children: [
        {
          id: 'stores-management',
          title: 'Store Management',
          type: 'collapse',
          icon: icons.StorefrontOutlinedIcon,
          children: [
            {
              id: 'viewall-stores',
              title: 'View All Stores',
              type: 'item',
              icon: icons.ListAltOutlinedIcon,
              url: '/stores'
            }
          ]
        },
        {
          id: 'Sales-management',
          title: 'Sales Management',
          type: 'collapse',
          icon: icons.ReceiptLongOutlinedIcon,
          children: [
            {
              id: 'sales-dashboard',
              title: 'Sales Dashboard',
              type: 'item',
              icon: icons.InsightsOutlinedIcon,
              url: '/sales'
            }
          ]
        },
        {
          id: 'banners-promotions',
          title: 'Banners & Promotions',
          type: 'collapse',
          icon: icons.ReceiptLongOutlinedIcon,
          children: [
            {
              id: 'promotion-dashboard',
              title: 'Promotion Dashboard',
              type: 'item',
              icon: icons.InsightsOutlinedIcon,
              url: '/promotions'
            },
            {
              id: 'banners-dashboard',
              title: 'Banners Dashboard',
              type: 'item',
              icon: icons.InsightsOutlinedIcon,
              url: '/banners'
            }
          ]
        },
        {
          id: 'coupons-management',
          title: 'Coupons Management',
          type: 'collapse',
          icon: icons.LocalOfferOutlinedIcon,
          children: [
            {
              id: 'all-coupons',
              title: 'All Coupons',
              type: 'item',
              icon: icons.ListAltOutlinedIcon,
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
          icon: icons.Inventory2OutlinedIcon,
          children: [
            {
              id: 'all-products',
              title: 'All Products',
              type: 'item',
              icon: icons.CategoryOutlinedIcon,
              url: '/products'
            },
            {
              id: 'add-product',
              title: 'Add Product',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/addproduct'
            }
          ]
        },
        {
          id: 'location-management',
          title: 'Location Management',
          type: 'collapse',
          icon: icons.LocationOnOutlinedIcon,
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
          icon: icons.BadgeOutlinedIcon,
          children: [
            {
              id: 'all-staff',
              title: 'All Staff',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/staff'
            }
          ]
        }
      ]
    },
    {
      id: 'utils',
      title: 'System Utils',
      type: 'group',
      children: [
        {
          id: 'security',
          title: 'Security',
          type: 'item',
          icon: icons.SecurityOutlinedIcon,
          url: '/security'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      children: [
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: icons.HelpOutlineOutlinedIcon,
          url: '/docs',
          external: true
        }
      ]
    }
  ]
};

export default menuConfig;
