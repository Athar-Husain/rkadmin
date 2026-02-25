// Inside AllUsers component

// Transform data for DataGrid
const rows = useMemo(() => {
  return users.map((u, index) => ({
    ...u,
    id: u._id,
    sl: index + 1,
    fullName: u.name,
    phone: u.mobile,
    status: u.isActive ? 'Active' : 'Pending',
    referral: u.referralCode || 'N/A',
    notifications: u.preferences?.notifications ? 'Yes' : 'No',
    smsAlerts: u.preferences?.smsAlerts ? 'Yes' : 'No',
    verified: u.isVerified ? 'Yes' : 'No'
  }));
}, [users]);

// KPI Calculations
const activeUsers = useMemo(() => rows.filter((r) => r.status === 'Active').length, [rows]);
const verifiedUsers = useMemo(() => rows.filter((r) => r.verified === 'Yes').length, [rows]);
const totalUsers = rows.length;

// Updated DataGrid Columns
const columns = [
  { field: 'sl', headerName: 'SL', width: 60 },
  {
    field: 'fullName',
    headerName: 'USER',
    flex: 1.5,
    renderCell: (params) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 36,
            height: 36,
            fontSize: '0.9rem',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 700
          }}
        >
          {params.row.fullName?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={700} color="#1B2559">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      </Stack>
    )
  },
  { field: 'phone', headerName: 'PHONE', flex: 1 },
  { field: 'city', headerName: 'CITY', flex: 1 },
  { field: 'area', headerName: 'AREA', flex: 1 },
  {
    field: 'status',
    headerName: 'STATUS',
    flex: 0.8,
    renderCell: (params) => {
      const isActive = params.value === 'Active';
      return (
        <Chip
          icon={<StatusIcon sx={{ fontSize: '10px !important', color: isActive ? '#01B574' : '#FFB547' }} />}
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(isActive ? '#01B574' : '#FFB547', 0.1),
            color: isActive ? '#01B574' : '#FFB547',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '10px'
          }}
        />
      );
    }
  },
  { field: 'verified', headerName: 'VERIFIED', flex: 0.8 },
  { field: 'walletBalance', headerName: 'WALLET', flex: 0.8 },
  { field: 'notifications', headerName: 'NOTIFICATIONS', flex: 1 },
  { field: 'smsAlerts', headerName: 'SMS ALERTS', flex: 1 },
  { field: 'userType', headerName: 'USER TYPE', flex: 1 },
  {
    field: 'createdAt',
    headerName: 'JOINED DATE',
    flex: 1,
    valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString('en-GB') : 'N/A')
  }
];

// Updated KPI Cards
<Grid container spacing={3} sx={{ mb: 4 }}>
  <Grid item xs={12} sm={6} md={4}>
    <KPICard title="Total Users" value={totalUsers} icon={<PeopleIcon />} color="#4318FF" />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <KPICard title="Active Users" value={activeUsers} icon={<PeopleIcon />} color="#01B574" />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <KPICard title="Verified Users" value={verifiedUsers} icon={<PeopleIcon />} color="#FFB547" />
  </Grid>
</Grid>;

// Update PDF & Excel Export
const exportPDF = () => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [
      ['SL', 'Name', 'Email', 'Phone', 'City', 'Area', 'Status', 'Verified', 'Wallet', 'Notifications', 'SMS Alerts', 'User Type', 'Joined']
    ],
    body: rows.map((r) => [
      r.sl,
      r.fullName,
      r.email,
      r.phone,
      r.city,
      r.area,
      r.status,
      r.verified,
      r.walletBalance,
      r.notifications,
      r.smsAlerts,
      r.userType,
      new Date(r.createdAt).toLocaleDateString()
    ]),
    theme: 'grid',
    headStyles: { fill: [67, 24, 255] }
  });
  doc.save('users_list.pdf');
};

const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map(
      ({ sl, fullName, email, phone, city, area, status, verified, walletBalance, notifications, smsAlerts, userType, createdAt }) => ({
        sl,
        fullName,
        email,
        phone,
        city,
        area,
        status,
        verified,
        walletBalance,
        notifications,
        smsAlerts,
        userType,
        joined: new Date(createdAt).toLocaleDateString()
      })
    )
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  XLSX.writeFile(workbook, 'users_export.xlsx');
};
