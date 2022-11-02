function addZero(vNumber) {
  return (vNumber < 10 ? '0' : '') + vNumber;
}

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  return `${year}-${addZero(month)}-${addZero(date)} ${addZero(
    hours
  )}:${addZero(minutes)}:${addZero(seconds)}`;
}

module.exports = getCurrentDate;
