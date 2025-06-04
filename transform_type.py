import arrow
from typing import Literal

TypeKey = Literal["string", "number", "float", "bool", "date"]


def date_format(date_str: str) -> str:
    date = arrow.get(date_str).to("utc")
    date = date.format('YYYY-MM-DDTHH:mm:ss[Z]')

    return date


def parse_bool(input: str):
    exception_values = {
        "true": True,
        "y": True,
        "yes": True,
        "1": True,
        "false": False,
        "n": False,
        "no": False,
        "0": False
    }

    if input in exception_values:
        return exception_values[input]

    return bool(input)


type_mapping = {
    "string": str,
    "number": int,
    "float": float,
    "bool": parse_bool,
    "date": date_format
}

OPERATORS = {
    ">": ">",
    ">=": ">=",
    "<": "<",
    "<=": "<=",
    "!=": "!=",
    "~": "LIKE",
    "!~": "NOT LIKE",
    "in": "IN",
    "!in": "NOT IN",
    "><": "BETWEEN",
}

def transform_type(input_value: str, type_key: TypeKey):
    """Transforms a string input to a specified type."""
    if type_key not in type_mapping:
        return input_value

    try:
        transformed_type = type_mapping[type_key](input_value)
    except ValueError:
        return input_value
    except TypeError:
        return input_value
    except Exception:
        return input_value

    return transformed_type

def get_operator_and_typed_value(raw_operator_value: list[str], type_key: TypeKey):
    operator_value = raw_operator_value.split(":", 1)
    if len(operator_value) == 1:
        typed_value = transform_type(operator_value[0], type_key)
        return ("=", typed_value)
    else:
        operator, raw_value = operator_value
        operator = OPERATORS.get(operator, "=")
        value = ""
        values = []
        
        if operator in ["IN", "NOT IN", "BETWEEN"]:
            raw_values = raw_value.split(",")
            for v in raw_values:
                value = transform_type(v, type_key)
                values.append(value)
        else:
            value = transform_type(raw_value, type_key)
        
        if operator in ["IN", "NOT IN", "BETWEEN"]:
            value = tuple(values)
        elif operator == "LIKE" or operator == "NOT LIKE":
            value = f"%{value}%"

        return (operator, value)
