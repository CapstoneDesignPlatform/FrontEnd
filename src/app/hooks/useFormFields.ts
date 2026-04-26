import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";

type FormFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function useFormFields<TValues extends Record<string, string>>(
  initialValues: TValues,
) {
  const [values, setValues] = useState<TValues>(initialValues);

  const handleChange = useCallback(
    (event: ChangeEvent<FormFieldElement>) => {
      const { name, value } = event.target;

      setValues((current) => ({
        ...current,
        [name]: value,
      }));
    },
    [],
  );

  const updateField = useCallback(
    <TName extends keyof TValues>(name: TName, value: TValues[TName]) => {
      setValues((current) => ({
        ...current,
        [name]: value,
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    handleChange,
    reset,
    setValues,
    updateField,
    values,
  };
}
