const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const uniqueId = () => {
  return s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4();
};

const pluralCheck = s => {
  if (s == 1) {
    return " ago";
  } else {
    return "s ago";
  }
};

export const timeConverter = timestamp => {
  const a = new Date(timestamp * 1000);
  const seconds = Math.floor((new Date() - a) / 1000);
  //Years
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " year" + pluralCheck(interval);
  }
  //Months
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " month" + pluralCheck(interval);
  }
  //Days
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " day" + pluralCheck(interval);
  }
  //Hours
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hour" + pluralCheck(interval);
  }
  //Minutes
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minute" + pluralCheck(interval);
  }
  //Seconds
  return Math.floor(seconds) + " second" + pluralCheck(seconds);
};
