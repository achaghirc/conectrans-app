import { State } from "./definitions";

export const handleZodError = (errors:State, name: string) => {
  return errors.errors?.some((el) => el.path.includes(name));
}
export const handleZodHelperText = (errors:State,name: string) => {
  return errors.errors?.some((el) => el.path.includes(name)) ? errors.errors?.filter((el) => el.path.includes(name))[0].message : '';
}
export const takeNumberFromString = (value: string) => {
  let str = value;
  if (value.includes(',')) {
    str = value.split(',')[0];
  }
  if (str.match(/\d+/g) === null || str.match(/\d+/g) === undefined || str.match(/\d+/g)!.length === 0) {
    return 'S/N';
  }
	return str.match(/\d+/g)!.map(Number);
}
export const SUCCESS_MESSAGE_SNACKBAR = "Datos actualizados correctamente";

