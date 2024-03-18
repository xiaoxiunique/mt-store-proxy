import { TableColumn } from "@pureadmin/table";

export function useGenSearchFields(fields: string[]) {
  return fields.map(field => {
    const SEPARATOR = field.includes(":") ? ":" : "：";
    const count = field.split(SEPARATOR).length;
    let prop = field;
    let label = field;
    let prefix = "";
    if (count === 1 && field.includes(SEPARATOR)) {
      [prop, label] = field.split(SEPARATOR);
    } else if (count === 2) {
      [prop, label, prefix] = field.split(SEPARATOR);
    }

    const column: any = {
      prop,
      label,
      prefix
    };
    return column;
  });
}

export function useEditColumns(fields: string[], metadata: any = {}) {
  metadata = metadata || {};
  const columns: TableColumn[] = fields.map(field => {
    const SEPARATOR = ":";
    const count = field.split(SEPARATOR).length;
    let prop = field;
    let label = field;
    if (count === 2 && field.includes(SEPARATOR)) {
      [prop, label] = field.split(SEPARATOR);
    } else if (count >= 3) {
      let props: string[] = [];
      [prop, label, ...props] = field.split(SEPARATOR);
      for (const p of props) {
        if (p.includes("_")) {
          const [key, value] = p.split("_");
          metadata[prop] = metadata[prop] || {};
          metadata[prop][key] = value;
        }
      }
    }

    const column: TableColumn = {
      prop,
      label,
      type: "input",
      ...(metadata[prop] || {})
    };
    return column;
  });

  return columns;
}
