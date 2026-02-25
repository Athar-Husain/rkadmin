export const calculateStaffStats = (staffList = []) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return staffList.reduce(
    (acc, staff) => {
      acc.total += 1;

      if (staff.isActive) acc.active += 1;
      else acc.inactive += 1;

      if (new Date(staff.createdAt) >= thirtyDaysAgo) {
        acc.newStaff += 1;
      }

      return acc;
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
      newStaff: 0
    }
  );
};
