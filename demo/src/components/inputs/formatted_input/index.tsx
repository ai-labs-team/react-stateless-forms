import { merge, omit } from 'ramda';
import * as React from 'react';

export type FormattedInputPropsWithoutFormat = {
  name: string;
  value: string | number;
  disabled?: boolean;
  disableTab?: boolean;
  label?: string;
  placeholder?: string;
  error?: boolean;
  onChange: (input: string | number) => any;
  type: string;
  maxLength?: number;
};

type FormattedInputProps = FormattedInputPropsWithoutFormat & {
  format: (input: string | number) => string | number;
  unformat: (input: string | number) => string | number;
};

type SelectionRange = {
  selectionStart: number;
  selectionEnd: number;
};

type FormattedInputState = SelectionRange & {
  currentValue: string | number;
  formattedValue: string | number;
};

const canSetSelectionRangeOnEmailType = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'email');

  try {
    input.setSelectionRange(0, 0);
  } catch (e) {
    return false;
  }
  return true;
};

const autoComplete = {
  name: 'name',
  streetAddress1: 'address-line1',
  streetAddress2: 'address-line2',
  zipCode: 'postalCode',
  state: 'address-level1',
  city: 'address-level2'
};

const selectionRangeOverrideTypes = [
  'text',
  canSetSelectionRangeOnEmailType() && 'email'
];

export default class FormattedInput extends React.Component<FormattedInputProps, FormattedInputState> {

  public static defaultProps: Partial<FormattedInputProps> = {
    label: '',
    placeholder: '',
    value: '',
    type: 'text',
    error: false,
    disabled: false,
    disableTab: false,
    onChange: () => { },
  };

  private input: HTMLInputElement;

  constructor(props: FormattedInputProps) {
    super(props);

    const formattedValue = props.format(props.value);
    this.state = {
      currentValue: props.value,
      formattedValue,
      selectionStart: String(formattedValue).length,
      selectionEnd: String(formattedValue).length,
    };
  }

  public componentWillReceiveProps({ value, format, unformat }: FormattedInputProps): void {
    const newUnformattedValue = String(unformat(value));

    if (this.state.currentValue !== newUnformattedValue) {
      this.setState({
        currentValue: newUnformattedValue,
        formattedValue: format(newUnformattedValue),
      });
    }
  }

  public componentDidUpdate({ }: FormattedInputProps, prevState: FormattedInputState): void {
    const shouldOverrideSelectionRange =
      selectionRangeOverrideTypes.includes(this.props.type) &&
      prevState.currentValue !== this.state.currentValue;

    if (shouldOverrideSelectionRange) {
      this.overrideSelectionRange();
    }
  }

  public render(): JSX.Element {
    const { label, name, error, disableTab, ...props } = this.props;
    const { onChange } = this;
    const value = this.state.formattedValue, tabIndex = disableTab ? -1 : 0;

    return (
      <section className={`FormattedInput input-style  ${error ? 'error' : ''}`}>
        <input
          ref={this.setInputRef}
          data-test-id={name}
          autoComplete={autoComplete[name] || ''}
          {...{ onChange, value, name, label, tabIndex }}
          {...omit(['unformat', 'format', 'onChange', 'dataTestId', 'selectOptions', 'value'], props)}
        />
        {label && <label htmlFor={name}>{label}</label>}
      </section>
    );
  }

  private onChange = (evt: any): void => {
    evt.persist();

    const { format, unformat, onChange } = this.props;
    const unformattedValue = unformat(String(evt.target.value)) || '';
    const formattedValue = format(unformattedValue);

    const handleChange = (evt: any, unformattedValue: any) => () => {
      const newEvt = { ...evt };
      newEvt.target.value = unformattedValue;
      newEvt.preventDefault = evt.preventDefault;
      onChange(newEvt);
    };

    this.setState(
      merge(this.calculateSelectionRange(formattedValue, unformattedValue), {
        currentValue: unformattedValue,
        formattedValue
      }),
      handleChange(evt, unformattedValue)
    );
  }

  private calculateSelectionRange(formattedValue: React.ReactText, unformattedValue: React.ReactText): SelectionRange {
    const { selectionStart, selectionEnd } = this.input;

    let formattedDiff = 0;
    if (formattedValue !== unformattedValue) {
      formattedDiff = String(formattedValue).length - String(this.state.formattedValue).length;
      formattedDiff += (formattedDiff > 0) ? -1 : 1;
    }

    let newSelectionStart = (selectionStart || 0) + formattedDiff;
    let newSelectionEnd = (selectionEnd || 0) + formattedDiff;

    if (newSelectionStart < 0) {
      newSelectionStart = String(formattedValue).length;
      newSelectionEnd = String(formattedValue).length;
    }

    return {
      selectionStart: newSelectionStart,
      selectionEnd: newSelectionEnd
    };
  }

  private overrideSelectionRange(): void {
    try {
      const { selectionStart, selectionEnd } = this.state;
      setTimeout(() => this.input.setSelectionRange(selectionStart, selectionEnd), 0);
    } catch (ex) { }
  }

  private setInputRef = (ref: HTMLInputElement): void => {
    this.input = ref;
  }
}
