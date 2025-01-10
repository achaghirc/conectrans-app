import { State } from "@/lib/definitions"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import useUtilsHook from "../../hooks/useUtils"

export function DatePickerComponent({value, label, name, errors, width, setValue}: {value: Dayjs, label?:string, name?: string, errors?: State, width?:any, setValue?: (value: Dayjs | null) => void}) {
    dayjs.locale('es');
    const { handleZodError, handleZodHelperText } = useUtilsHook();
    return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DemoContainer components={['DatePicker']}>
        <DatePicker
			      format='DD-MM-YYYY'
            label={label}
            name={name ?? ''}
            value={value}
            onChange={(newValue) => setValue && setValue(newValue)}
            slotProps={{
              textField: {
                error: handleZodError(errors ?? {errors: [], message: null}, name ?? ''),
                helperText: handleZodHelperText(errors ?? {errors: [], message: null}, name ?? ''),
                required: true,
                placeholder: '01-01-2024'
              }
            }}
            sx={{
              width: width ?? '100%'
            }}
        />
      </DemoContainer>
    </LocalizationProvider>
	)
}

export function DateMobilePickerComponent({value,label, name, errors, setValue}: {value: Dayjs, label:string, name?: string, errors:State, setValue: (value: Dayjs | null) => void}) {
  dayjs.locale('es');
  const { handleZodError, handleZodHelperText } = useUtilsHook();
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
			<DemoContainer components={['MobileDatePicker']}>
				<MobileDatePicker
          label={label}
          name={name ?? ''}
					format='DD-MM-YYYY'
					value={value}
					onChange={(newValue) => setValue(newValue)}
					slotProps={{
						textField: {
							error: handleZodError(errors, name ?? ''),
							helperText: handleZodHelperText(errors, name ?? ''),
              required: true,
              placeholder: '01-01-2024'
						}
					}}
					sx={{
						width: '100%'
					}}
				/>
			</DemoContainer>
		</LocalizationProvider>
	)
}
