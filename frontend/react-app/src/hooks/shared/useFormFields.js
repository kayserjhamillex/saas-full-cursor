import { useState } from 'react'

export function useFormFields(initialValues) {
  const [fields, setFields] = useState(initialValues)

  function updateField(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  return {
    fields,
    setFields,
    updateField,
  }
}
