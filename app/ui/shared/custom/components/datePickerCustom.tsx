import { State } from "@/lib/definitions"
import { handleZodError, handleZodHelperText } from "@/lib/utils"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';

export function DatePickerComponent({value, label, errors, width, setValue}: {value: Dayjs, label?:string, errors?: State, width?:any, setValue: (value: Dayjs | null) => void}) {
    dayjs.locale('es');

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DemoContainer components={['DatePicker']}>
        <DatePicker
            
			      format='YYYY-MM-DD'
            label={label}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            slotProps={{
              textField: {
                error: handleZodError(errors ?? {errors: [], message: null}, label ?? ''),
                helperText: handleZodHelperText(errors ?? {errors: [], message: null}, label ?? '')
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

export function DateMobilePickerComponent({value,label, errors, setValue}: {value: Dayjs, label:string, errors:State, setValue: (value: Dayjs | null) => void}) {
    dayjs.locale('es');

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
			<DemoContainer components={['MobileDatePicker']}>
				<MobileDatePicker
                    label={label}
					format='YYYY-MM-DD'
					value={value}
					onChange={(newValue) => setValue(newValue)}
					slotProps={{
						textField: {
							error: handleZodError(errors, label),
							helperText: handleZodHelperText(errors, label)
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
