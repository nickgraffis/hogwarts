export const time = (date: number | Date) => {
  const d = new Date(date);
  let hours: string | number = d.getHours();
  let minutes: string | number = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}