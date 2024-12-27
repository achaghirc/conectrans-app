import { State } from '@/lib/definitions';

const useUtilsHook = () => {
  const handleZodError = (errors:State, name: string) => {
    return errors.errors?.some((el) => el.path.includes(name));
  }
  const handleZodHelperText = (errors:State,name: string) => {
    return errors.errors?.some((el) => el.path.includes(name)) ? errors.errors?.filter((el) => el.path.includes(name))[0].message : '';
  }

  const countWords = (text: string) => {
    return text ? text.length : 0;
  };
  return {
    handleZodError,
    handleZodHelperText,
    countWords
  }
}

export default useUtilsHook;
