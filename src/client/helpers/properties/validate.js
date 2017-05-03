export default function validate(value) {
  if (this.required && !value) {
    return 'required';
  }
  if (value != null
      && this.maxLength
      && value.length > this.maxLength
  ) {
    return 'too long';
  }
  if (value
      && this.minLength
      && value.length < this.minLength
  ) {
    return 'too short';
  }

  if (value
      && this.pattern
      && !this.pattern.test(value)) {
    return 'invalid';
  }

  return undefined;
}
