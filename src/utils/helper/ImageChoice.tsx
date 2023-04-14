function getImage(ele: string, read: boolean) {
  if (ele === 'phone' || ele === 'sms') {
    return 'phone';
  }
  if (read === false) {
    return 'email';
  } else {
    return 'emailOpen';
  }
}

export default getImage;
