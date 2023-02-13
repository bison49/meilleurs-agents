function date(d: Date) {
  const mailDate = new Date(d);
  const month = mailDate.toLocaleString('default', { month: 'long' });
  return (
    'Le ' +
    mailDate.getDate() +
    ' ' +
    month +
    ' ' +
    mailDate.getFullYear() +
    ' à ' +
    mailDate.getHours() +
    ':' +
    mailDate.getMinutes()
  );
}

export default date;
