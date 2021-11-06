import { notification } from "antd";
export function handleShifts(object) {
  const keys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  let listShifts = [];
  keys.forEach((item) => {
    if (object[item]) {
      listShifts= listShifts.concat(object[item]);
    }
  });
  return listShifts;
}

export const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: message,
  });
};

export function handleSkills(values){
  let listSkills=[]
  values.forEach((item)=>{
    listSkills= listSkills.concat(item.id);
  })
  return listSkills;
}

export function handleShift(values) {
  let listShifts = [];
  values.forEach((item) => {
   listShifts = listShifts.concat(item.id);
  });
  return listShifts;
}