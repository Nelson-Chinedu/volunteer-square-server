const getEventError = (args: any) => {
  const { name, description, location, category, date, time } = args;
  if (name.length <= 0) {
    return {
      message: 'Event name is required',
    };
  }
  if (description.length <= 0) {
    return {
      message: 'Event description is required',
    };
  }
  if (location.length <= 0) {
    return {
      message: 'Event location is required',
    };
  }
  if (category.length <= 0) {
    return {
      message: 'Event category is required',
    };
  }
  if (date.length <= 0) {
    return {
      message: 'Event date is required',
    };
  }
  if (time.length <= 0) {
    return {
      message: 'Event time is required',
    };
  }
};

export default getEventError;
