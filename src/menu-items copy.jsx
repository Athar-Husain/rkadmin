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
          url: '/dashboard/default'
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
            // {
            //   id: 'area-view',
            //   title: 'View Areas / Network',
            //   type: 'item',
            //   icon: icons.ChromeReaderModeOutlinedIcon,
            //   url: '/areas'
            // },
            // {
            //   id: 'area-view',
            //   title: 'View Areas / Network',
            //   type: 'item',
            //   icon: icons.ChromeReaderModeOutlinedIcon,
            //   url: '/areas'
            // }
          ]
        },
        {
          id: 'purchase-management',
          title: 'Purchase Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'purchase-dashboard',
              title: 'Purchase Dashboard',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/purchases'
            }
            // {
            //   id: 'add-coupon',
            //   title: 'Create Coupon',
            //   type: 'item',
            //   icon: icons.PersonAddAlt1OutlinedIcon,
            //   url: '/createcoupon'
            // }
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
            },
            {
              id: 'add-coupon',
              title: 'Create Coupon',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/createcoupon'
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
            // {
            //   id: 'add-customer',
            //   title: 'Add Customer',
            //   type: 'item',
            //   icon: icons.PersonAddAlt1OutlinedIcon,
            //   url: '/customer/add'
            // },
            // {
            //   id: 'all-connections',
            //   title: 'All Connections',
            //   type: 'item',
            //   icon: icons.AppRegistrationOutlinedIcon,
            //   url: '/connections'
            // }
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
          id: 'team-management',
          title: 'Team Management',
          type: 'collapse',
          icon: icons.GroupOutlinedIcon,
          children: [
            {
              id: 'all-teams',
              title: 'All Teams',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/team/all'
            },
            {
              id: 'add-team',
              title: 'Add Team',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/team/create'
            },
            {
              id: 'suspended-teams',
              title: 'Suspended Teams',
              type: 'item',
              icon: icons.BlockOutlinedIcon,
              url: '/team/suspended'
            },
            {
              id: 'team-roles',
              title: 'Roles',
              type: 'item',
              icon: icons.SupervisorAccountOutlinedIcon,
              url: '/team/roles'
            }
          ]
        },
        {
          id: 'area-management',
          title: 'City / Area Management',
          type: 'collapse',
          icon: icons.ChromeReaderModeOutlinedIcon,
          children: [
            {
              id: 'all-city',
              title: 'All Cities',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/cities'
            },
            {
              id: 'create-city',
              title: 'Create City',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/addcity'
            },
            {
              id: 'add-area',
              title: 'Add Area',
              type: 'item',
              icon: icons.CategoryOutlinedIcon,
              url: '/addarea'
            }
          ]
        },
        {
          id: 'staff-management',
          title: 'Staff / Area Management',
          type: 'collapse',
          icon: icons.ChromeReaderModeOutlinedIcon,
          children: [
            {
              id: 'all-staff',
              title: 'All Staff',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/staff'
            },
            {
              id: 'create-staff',
              title: 'Create City',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/createstaff'
            }
            // {
            //   id: 'add-area',
            //   title: 'Add Area',
            //   type: 'item',
            //   icon: icons.CategoryOutlinedIcon,
            //   url: '/addarea'
            // }
          ]
        },

        {
          id: 'tickets-management',
          title: 'Tickets & Complaints',
          type: 'collapse',
          icon: icons.ReportProblemOutlinedIcon,
          children: [
            {
              id: 'tickets-list',
              title: 'Tickets List',
              type: 'item',
              icon: icons.ReportProblemOutlinedIcon,
              url: '/tickets-list'
            },
            {
              id: 'tickets-board',
              title: 'Tickets Board',
              type: 'item',
              icon: icons.HourglassEmptyOutlinedIcon,
              url: '/tickets-board'
            }
          ]
        },

        {
          id: 'leads-management',
          title: 'Leads Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'leads-dashboard',
              title: 'Leads Dashboard',
              type: 'item',
              icon: icons.DashboardOutlinedIcon,
              url: '/leads'
            },
            {
              id: 'all-leads',
              title: 'All Leads',
              type: 'item',
              icon: icons.ListAltOutlinedIcon,
              url: '/leads/dashboard'
            },
            {
              id: 'add-lead',
              title: 'Add Lead',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/leads/add'
            }
          ]
        },
        {
          id: 'billing-management',
          title: 'Billing Management',
          type: 'collapse',
          icon: icons.CreditCardOutlinedIcon,
          children: [
            {
              id: 'all-billing',
              title: 'All Billings',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/billing'
            }
            // {
            //   id: 'add-billing-customer',
            //   title: 'Add Customer',
            //   type: 'item',
            //   icon: icons.PersonAddAlt1OutlinedIcon,
            //   url: '/customer/add'
            // },
            // {
            //   id: 'all-billing-connections',
            //   title: 'All Connections',
            //   type: 'item',
            //   icon: icons.AppRegistrationOutlinedIcon,
            //   url: '/connections'
            // }
          ]
        }
        // {
        //   id: 'projects-boards',
        //   title: 'Project Boards',
        //   type: 'collapse',
        //   icon: icons.AppsOutlinedIcon,
        //   children: [
        //     {
        //       id: 'project-board',
        //       title: 'Board',
        //       type: 'item',
        //       icon: icons.AppsOutlinedIcon,
        //       url: '/kanban'
        //     }
        //   ]
        // }
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
