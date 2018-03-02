export default (obj, key, defaultValue) => {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = defaultValue;
  }
  return obj;
};
