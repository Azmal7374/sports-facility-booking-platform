const payableAmountCalculate = (
  endTime: string,
  startTime: string,
  pricePerHour: number,
): number => {
  const presentDay = new Date();

  //time divide two partss
  const startTimeParts = startTime.split(':');
  const endTimeParts = endTime.split(':');

  // start time Parse
  const start = new Date(presentDay);
  start.setHours(
    parseInt(startTimeParts[0]),
    parseInt(startTimeParts[1]),
    0,
    0,
  );

  // End time Parse
  const end = new Date(presentDay);
  end.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);

  // parse date validity checking
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid start time or end time');
  }

  // calculate duration per hourse
  const durationTime = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  if (durationTime < 0) {
    throw new Error('End time must be bigger than start time');
  }

  // total payable amount calculate
  const totalPayableAmount = durationTime * pricePerHour;

  return totalPayableAmount;
};

export default payableAmountCalculate;
