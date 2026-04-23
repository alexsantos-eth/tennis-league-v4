import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";

interface KycInputProps extends React.ComponentProps<"input"> {
  error?: string;
  title?: string;
  icon?: React.ReactNode;
}

const KycInput: React.FC<KycInputProps> = ({
  value,
  onChange,
  placeholder,
  icon,
  ...props
}) => {
  return (
    <label className="flex flex-col">
      <Text variant="bodySmall">{props.title}</Text>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        <Input
          value={value}
          placeholder={placeholder}
          className="pl-9"
          onChange={onChange}
          {...props}
        />
      </div>
      {props.error && <p className="text-xs text-rose-300 mt-2">{props.error}</p>}
    </label>
  );
};

export default KycInput;
