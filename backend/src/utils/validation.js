const validateSearchParams = (params) => {
  const { startDate, endDate, minPrice, maxPrice, limit, skip } = params;

  // Validate dates
  if (startDate && !isValidDate(startDate)) {
    return "Invalid start date format";
  }
  if (endDate && !isValidDate(endDate)) {
    return "Invalid end date format";
  }
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return "Start date cannot be after end date";
  }

  // Validate prices
  if (minPrice && isNaN(minPrice)) {
    return "Invalid minimum price";
  }
  if (maxPrice && isNaN(maxPrice)) {
    return "Invalid maximum price";
  }
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return "Minimum price cannot be greater than maximum price";
  }

  // Validate pagination
  if (limit && (isNaN(limit) || Number(limit) < 1)) {
    return "Invalid limit value";
  }
  if (skip && (isNaN(skip) || Number(skip) < 0)) {
    return "Invalid skip value";
  }

  return null;
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

module.exports = {
  validateSearchParams,
};
