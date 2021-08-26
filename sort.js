const toProps = (dateElem) => {
  const props = new Map();
  const tmpArr = dateElem["Дата и время"].split(" ");
  const dmy = tmpArr[0].split(".");
  const hms = tmpArr[1].split(":");
  props.set("Day", +dmy[0]);
  props.set("Mounth", +dmy[1]);
  props.set("Year", +dmy[2]);
  props.set("Hour", +hms[0]);
  props.set("Minute", +hms[1]);
  props.set("Second", +hms[2]);
  return props;
};

const sortJSON = (data) =>
  data.sort((a, b) => {
    const propsA = toProps(a);
    const propsB = toProps(b);
    if (propsA.get("Year") > propsB.get("Year")) {
      return 1;
    } else {
      return -1;
    }
    if (propsA.get("Mouth") > propsB.get("Mouth")) {
      return 1;
    } else {
      return -1;
    }
    if (propsA.get("Day") > propsB.get("Day")) {
      return 1;
    } else {
      return -1;
    }
    if (propsA.get("Hour") > propsB.get("Hour")) {
      return 1;
    } else {
      return -1;
    }
    if (propsA.get("Minute") > propsB.get("Minute")) {
      return 1;
    } else {
      return -1;
    }
    if (propsA.get("Second") > propsB.get("Second")) {
      return 1;
    } else {
      return -1;
    }
  });
module.exports.sortJSON = sortJSON;
