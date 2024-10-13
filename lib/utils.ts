import { clsx, type ClassValue } from "clsx"
import { ZodIssue } from "zod";
import { State } from "./definitions";

export const handleZodError = (errors:State, name: string) => {
  return errors.errors?.some((el) => el.path.includes(name));
}
export const handleZodHelperText = (errors:State,name: string) => {
  return errors.errors?.some((el) => el.path.includes(name)) ? errors.errors?.filter((el) => el.path.includes(name))[0].message : '';
}

