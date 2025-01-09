import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerComponentProps {
  show: boolean;
  setShow: (show: any) => any;
  date: Date;
  setDate: (date: any) => any;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  show,
  setShow,
  date,
  setDate,
}) => {
  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  if (!show) return null;

  return (
    <DateTimePicker
      value={date}
      mode="date"
      display="default"
      onChange={onChange}
    />
  );
};

export default DatePickerComponent;
