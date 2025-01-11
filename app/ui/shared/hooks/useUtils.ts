import { State } from '@/lib/definitions';
import { FilterOffersDTO } from '../../offers/OffersGeneralComponent';

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

  const getFilterDataFromQuery = (searchParams: URLSearchParams): FilterOffersDTO => {
    const params = searchParams;
    const data = {
      contractType: params.getAll('contractType') ?? [],
      country: params.get('country') ?? null,
      state: params.get('state') ?? null,
      licenseType: params.getAll('licenseType') ?? [],
      adrType: params.getAll('adrType') ?? [],
      workRange: params.getAll('workRange') ?? [],
      experience: params.get('experience') ?? null,
      isFeatured: params.get('isFeatured') === 'true' ? true : false,
      isAnonymous: params.get('isAnonymous') === 'true' ? true : false,
      allOffers: params.get('allOffers') === 'true' ? true : false
    };
    return data; 
  }

  return {
    handleZodError,
    handleZodHelperText,
    countWords,
    getFilterDataFromQuery
  }
}

export default useUtilsHook;
