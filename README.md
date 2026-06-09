# create app
cd dispatch_dashboard
npm create vite@latest dispatch-dashboard. -- -- template react

#install dependencies
npm install
react-router-dom
@mui/material @emotion/react @emotion/styled
axios
@mui/icons-material

#run project
npm dev run

Local: http://localhost:5173/


src/
│
├── components/
├── pages/
├── layouts/
├── services/
├── routes/
├── theme/
│
├── App.jsx
└── main.jsx

#target dashboard design
Dashboard

Operations
  Trips
  Dispatch Board
  Live Map

Drivers
  Drivers
  Driver Tracking
  Driver Performance

Billing
  Invoices
  Claims
  Payments
  Payouts

Clients
  Riders
  Facilities

Fleet
  Vehicles
  Maintenance

Reports
  Analytics
  Revenue Reports
  Trip Reports



# FUNCTIONALITY

Step 1 → Sidebar architecture ✅
Step 2 → Routing ✅
Step 3 → Dashboard UI ✅
Step 4 → Login Page
Step 5 → Authentication & Role-Based Access Control (RBAC) 

# Roles
SYSTEM_ADMIN
DISPATCH
FINANCE

| Feature             | Admin  | Dispatch  | Finance  |
| ------------------- | -----  | --------  | -------  |
| Dashboard           | ✅     | ✅        | ✅       |
| Trips               | ✅     | ✅        | ❌       |
| Dispatch Board      | ✅     | ✅        | ❌       |
| Live Tracking       | ✅     | ✅        | ❌       |
| Scheduling          | ✅     | ✅        | ❌       |
| Drivers             | ✅     | ✅        | ❌       |
| Vehicles            | ✅     | ✅        | ❌       |
| Invoices            | ✅     | ❌        | ✅       |
| Payments            | ✅     | ❌        | ✅       |
| Claims              | ✅     | ❌        | ✅       |
| Payouts             | ✅     | ❌        | ✅       |
| Analytics           | ✅     | Limited   | Limited  |
| Users               | ✅     | ❌        | ❌       |
| Roles & Permissions | ✅     | ❌        | ❌       |
| Integrations        | ✅     | ❌        | ❌       |


# Workflow

Client books trip
        ↓
Trip received
        ↓
Dispatcher reviews
        ↓
Accept OR Reject
        ↓
Payment processed
        ↓
Reserved
        ↓
Assign Driver
        ↓
Driver Notified
        ↓
Pickup
        ↓
In Transit
        ↓
Completed