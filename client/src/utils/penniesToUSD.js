const penniesToUSD = (number) => {
  if (number === 0) {
    return "Free";
  } else {
    return (number / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
};

export default penniesToUSD;
