export const getMissionYears = () => {
  const thisYear = new Date().getFullYear();
  const years = [];

  for (let year = thisYear; year >= 2000; year--) {
    years.push(year);
  }

  return years;
};
