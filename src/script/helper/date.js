import moment from 'moment';

const getDate = (value, format = 'DD MMMM YYYY') => {
  if (!value) return '-';
  return moment(value).format(format);
}

const today = () => {
  return new Date();
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
  return moment(value).format('hh:mm');
}

export {
  getDate,
  today,
  tomorrow,
  yesterday,
  getTime
};