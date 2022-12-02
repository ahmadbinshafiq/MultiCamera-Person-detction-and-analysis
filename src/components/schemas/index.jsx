import * as Yup from "yup";
const ipRegExp = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;
export const camSchema = Yup.object({
  camname: Yup.string().min(2).max(25).required(),
  camip: Yup.string().matches(ipRegExp, 'IP is not valid'),
  camport: Yup.number("It should be number").min(1).max(9).required("Please enter the Port Number"),

});