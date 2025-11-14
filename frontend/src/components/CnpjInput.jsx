import { PatternFormat } from "react-number-format";
import Input from "./Input";

export default function CnpjInput({ ...props }) {
  return (
    <PatternFormat
      {...props}
      format="##.###.###/####-##"
      customInput={Input}
      placeholder="00.000.000/0000-00"
    />
  );
}
