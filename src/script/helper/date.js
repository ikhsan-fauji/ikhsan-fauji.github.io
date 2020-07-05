const getDate = (value, format = 'DD MMMM YYYY') => {
  if (!value) return '-';
  const date = new Date(value);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  if (format.includes('YYYY-MM-DD')) {
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    return `${year}-${month}-${day}`;
  } else {
    const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
    return `${day} ${month} ${year}`;
  }
}

const today = () => {
  const date = new Date();
  return date;
}

const tomorrow = (additionalDay = 1) => {
  let date = new Date();
  date.setDate(date.getDate() + additionalDay);
  return date;
}

const yesterday = (reducerDay = 1) => {
  let date = new Date();
  date.setDate(date.getDate() - reducerDay);
  return date;
}

const getTime = (value) => {
  if (!value) return '-';
  const date = new Date(value)
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  hours = hours.length === 1 ? '0' + hours : hours;
  minutes = minutes.length === 1 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
}

export {
  getDate,
  today,
  tomorrow,
  yesterday,
  getTime
};