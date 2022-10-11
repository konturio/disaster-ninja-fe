import clsx from 'clsx';
import { useCallback, useState } from 'react';
import s from './Textarea.module.css';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
  placeholder?: string;
  showTopPlaceholder: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  placeholder,
  showTopPlaceholder,
  value,
  onChange,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const onInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange && onChange(ev);
    },
    [onChange],
  );

  const onFocus = useCallback(
    (e) => {
      setIsFocused(true);
    },
    [setIsFocused],
  );

  const onBlur = useCallback(
    (e) => {
      setIsFocused(false);
    },
    [setIsFocused],
  );

  return (
    <div className={clsx(s.inputWrap, isFocused && s.focus)}>
      {placeholder && showTopPlaceholder && (
        <div className={s.topPlaceholder}>{placeholder}</div>
      )}
      <textarea
        value={value}
        onChange={onInputChange}
        placeholder={!showTopPlaceholder ? placeholder : undefined}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      ></textarea>
    </div>
  );
}
