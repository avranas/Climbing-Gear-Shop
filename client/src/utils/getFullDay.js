//Get JS date, return string of date in "January 1, 1999" format
const getFullUTCDay = (date) => {
  return `${date.getUTCMonth()}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
};

module.exports = getFullUTCDay;
