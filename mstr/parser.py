"""
Parser -- extrae columnas y filas del JSON jerarquico de MicroStrategy.
"""

from __future__ import annotations


def extract_columns(result):
    definition = result.get("definition", {})
    attributes = definition.get("attributes", [])
    metrics = definition.get("metrics", [])
    attr_names = [a.get("name", "") for a in attributes]
    metric_names = [m.get("name", "") for m in metrics]
    all_columns = attr_names + metric_names
    if not all_columns:
        raise RuntimeError("No se encontraron columnas en la definicion del reporte")
    return all_columns, metric_names


def extract_rows(result, metric_names, num_columns):
    root = result.get("data", {}).get("root", {})
    nodes = root.get("children", [])
    if not nodes:
        return []
    rows = []

    def _walk(current_nodes, path=None):
        if path is None:
            path = []
        for node in current_nodes:
            if "element" in node:
                el = node["element"]
                if "formValues" in el and el["formValues"]:
                    value = list(el["formValues"].values())[0]
                else:
                    value = el.get("name", "")
            else:
                value = ""
            new_path = path + [str(value)]
            if node.get("children"):
                _walk(node["children"], new_path)
            else:
                row = new_path[:]
                mv = node.get("metrics", {})
                for mname in metric_names:
                    md = mv.get(mname, {})
                    row.append(md.get("rv", md.get("fv", "")))
                while len(row) < num_columns:
                    row.append("")
                if len(row) > num_columns:
                    row = row[:num_columns]
                rows.append(row)

    _walk(nodes)
    return rows


def extract_dossier_grid(payload):
    grid = None
    if "result" in payload:
        result = payload["result"]
        definition = result.get("definition", {})
        if definition.get("attributes") or definition.get("metrics"):
            columns, metric_names = extract_columns(result)
            rows = extract_rows(result, metric_names, len(columns))
            return columns, rows
        grid = result.get("data", {}).get("grid", {})
    if grid is None:
        grid = payload.get("grid", {})
    if not grid:
        if "definition" in payload and "data" in payload:
            grid = payload.get("data", {}).get("grid", {})
    if not grid:
        if "definition" in payload:
            columns, metric_names = extract_columns(payload)
            rows = extract_rows(payload, metric_names, len(columns))
            return columns, rows
        raise RuntimeError("No se encontro estructura de datos en la respuesta del dossier")

    columns = []
    col_headers = grid.get("headers", {}).get("columns", [])
    row_headers = grid.get("headers", {}).get("rows", [])
    for header in row_headers:
        columns.append(header.get("name", ""))
    for header in col_headers:
        columns.append(header.get("name", ""))
    if not columns:
        grid_def = grid.get("definition", {})
        for attr in grid_def.get("attributes", []):
            columns.append(attr.get("name", ""))
        for metric in grid_def.get("metrics", []):
            columns.append(metric.get("name", ""))

    rows = []
    grid_rows = grid.get("rows", [])
    for row_data in grid_rows:
        row = []
        for header_val in row_data.get("headerValues", []):
            if isinstance(header_val, dict):
                row.append(str(header_val.get("value", header_val.get("name", ""))))
            else:
                row.append(str(header_val))
        for metric_val in row_data.get("metricValues", []):
            if isinstance(metric_val, dict):
                row.append(metric_val.get("rv", metric_val.get("fv", metric_val.get("v", ""))))
            else:
                row.append(str(metric_val))
        if columns:
            while len(row) < len(columns):
                row.append("")
            if len(row) > len(columns):
                row = row[:len(columns)]
        rows.append(row)

    return columns, rows
