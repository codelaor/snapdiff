export function formatTime(time) {
  let formattedTime = '';

  // Return time exlcuding GMT/Timezone data
  if (time) {
    const timeString = time.toTimeString();
    formattedTime = timeString.substr(0, timeString.indexOf(' '));
  }

  return formattedTime;
}
