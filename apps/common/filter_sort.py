from sqlalchemy import asc, desc
from sqlalchemy.orm import Query


class Sort:
    def generic_sorting(
        self, query: Query, sort: str, order: str, sorting_options: dict
    ) -> Query:
        """Generic method for sorting

        Args:
            query (Query): Sqlalchemy model query
            sort (str): sorting key
            order (str): ordering key, desc or asc
            sorting_options (dict): dictionary of sorting options

        Raises:
            ValueError: Invalid params

        Returns:
            Query: Sqlalchemy query
        """
        sorting_key = sorting_options.get(sort.lower(), None)

        if order.lower() == "asc":
            query = query.order_by(asc(sorting_key))
        elif order.lower() == "desc":
            query = query.order_by(desc(sorting_key))
        else:
            raise ValueError("Invalid order parameter. Use 'asc' or 'desc'.")

        return query
