/**
 * Calculates comprehensive staff analytics.
 * Optimized for performance and data safety.
 */
export const calculateStaffStats = (staffList = []) => {
  // 1. Safety Check
  if (!Array.isArray(staffList)) {
    return { total: 0, active: 0, inactive: 0, newStaff: 0, managerCount: 0, growthRate: 0 };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const previousMonthStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const stats = staffList.reduce(
    (acc, staff) => {
      // Basic Counts
      acc.total += 1;

      // Status Tracking
      if (staff?.isActive) {
        acc.active += 1;
      } else {
        acc.inactive += 1;
      }

      // Role Distribution (Useful for Dashboard filters)
      if (staff?.role?.toLowerCase() === 'manager') {
        acc.managerCount += 1;
      }

      // Time-based Analytics
      const createdDate = new Date(staff?.createdAt);
      if (!isNaN(createdDate)) {
        // Joined in the last 30 days
        if (createdDate >= thirtyDaysAgo) {
          acc.newStaff += 1;
        }
        // Joined between 60 and 30 days ago (for trend comparison)
        if (createdDate >= previousMonthStart && createdDate < thirtyDaysAgo) {
          acc.prevMonthStaff += 1;
        }
      }

      return acc;
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
      newStaff: 0,
      managerCount: 0,
      prevMonthStaff: 0
    }
  );

  // 2. Calculate Trends (Percentage of growth vs previous month)
  const growth = stats.prevMonthStaff === 0 ? stats.newStaff * 100 : ((stats.newStaff - stats.prevMonthStaff) / stats.prevMonthStaff) * 100;

  return {
    ...stats,
    growthRate: Math.round(growth),
    activePercentage: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
  };
};
