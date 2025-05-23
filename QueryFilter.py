from lib.transform_type import get_operator_and_typed_value

def parse_filters(query_params, allowed_filters):
    filters = []
    for param_name, param_value in query_params.items():
        if param_name in allowed_filters:
            filters.append({
                "value": param_value,
                "fields": allowed_filters[param_name].get("fields"),
                "type": allowed_filters[param_name].get("type", "string"),
                "prefix_field": allowed_filters[param_name].get("prefix_field", True),
            })
    return filters

def apply_filters(query_builder, filters):
    for filter in filters:
        fields = filter.get("fields")
        should_prefix_field = filter.get("prefix_field")
        fields = [fields] if isinstance(fields, str) else fields
        raw_value = filter.get("value")
        should_apply_or_where = len(fields) > 1
        if should_apply_or_where:
            single_where_clause = []
            for field in fields:
                operator, value = get_operator_and_typed_value(raw_value, filter.get("type"))
                single_where_clause.append([field, operator, value, should_prefix_field])
            query_builder.or_where(single_where_clause)
        else:
            operator, value = get_operator_and_typed_value(raw_value, filter.get("type"))
            query_builder.where(fields[0], operator, value, should_prefix_field)
    return query_builder
