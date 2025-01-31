import { Country, Province, SignUpCandidateFormData, State } from "@/lib/definitions";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, styled } from "@mui/material";
import { useEffect, useState } from "react";
import useUtilsHook from "../../hooks/useUtils";

export const SelectInputCustom = styled(Select)(({}) => ({
	maxHeight: 300,
	overflow: 'auto',
	
}));

type SelectFormProps = {
	label: string,
	id: string,
	name: string,
	value: string,
	onChange: (e: SelectChangeEvent<string>) => Promise<void>;
	items: [],
	errors: State,
}

export const SelectFormInput = ({
	label,
	id,
	name,
	value,
	items,
	errors,
	onChange
}: SelectFormProps) => {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
	const [countries, setCountries] = useState<Country[]>([]);
	const [provinces, setProvinces] = useState<Province[]>([]);

	useEffect(() => {
		if(name === 'country'){
			setCountries(items)
		}else {
			setProvinces(items)
		}
	}, [name, items])
	return (
		<FormControl fullWidth error={handleZodError(errors, 'country')} required>
			<InputLabel>{label}</InputLabel>
			<Select 
				label={label}
				id={id}
				name={name}
				value={value ?? ''}
				onChange={onChange}
				MenuProps={{
					PaperProps: {
						style: {
							maxHeight: 300,
							overflow: 'auto',
						},
					},
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left',
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left',
					},
				}}	
			>
				{name === 'country' ? (
					countries.map((item) => (
						<MenuItem key={item.id} value={item.cod_iso2 ?? 'ES'}>
							{item.name_es}
						</MenuItem>
					))
					
				): (
					provinces.map((item) => (
						<MenuItem key={item.id} value={item.cod_iso2 ?? 'ES'}>
							{item.name}
						</MenuItem>
					))
				)}
			</Select>
			<FormHelperText>{handleZodHelperText(errors, 'country')}</FormHelperText>
		</FormControl>
	)
}