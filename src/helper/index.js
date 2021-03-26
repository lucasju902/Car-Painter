const getDifferenceFromToday = (past_date) => {
  const difference_In_Second =
    new Date().getTime() / 1000 - new Date(past_date).getTime();
  if (difference_In_Second < 60) {
    return `${Math.round(difference_In_Second)} seconds ago`;
  }
  const difference_In_Min = difference_In_Second / 60;
  if (difference_In_Min < 60) {
    return `${Math.round(difference_In_Min)} minutes ago`;
  }
  const difference_In_Hour = difference_In_Min / 60;
  if (difference_In_Hour < 24) {
    return `${Math.round(difference_In_Hour)} hours ago`;
  }
  const difference_In_Day = difference_In_Hour / 24;
  return `${Math.round(difference_In_Day)} days ago`;
};
const sortBy = (a, b, attribute, inc = true) => {
  if (a[attribute] > b[attribute]) {
    if (inc) return -1;
    return 1;
  }
  if (b[attribute] < a[attribute]) {
    if (inc) return 1;
    return -1;
  }
  return 0;
};

export default {
  getDifferenceFromToday,
  sortBy,
};
