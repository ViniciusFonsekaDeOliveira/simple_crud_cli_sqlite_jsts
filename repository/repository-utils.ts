class EmptyRecordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmptyRecordError";
  }
}

export function getWhereClauseConditions(
  data: Record<string, string>
): (string | string[])[] {
  const conditions = Object.keys(data).map((column) => `${column}=?`);
  const clauseValues = Object.values(data);
  const size = Object.keys(data).length;

  if (size == 1) return [conditions[0], clauseValues];
  else if (size >= 2) {
    const clauseConditions = conditions.join(" AND ");
    return [clauseConditions, clauseValues];
  } else {
    console.error("Erro. Where clause conditions can not be empty!");
    throw new EmptyRecordError(
      "O objeto data da função getWhereClauseConditions está vazio."
    );
  }
}
