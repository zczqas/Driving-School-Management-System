from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.gas_station import GasStation


class SortGasStation:
    def sorting_gas_stations(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "name": GasStation.name,
            "address": GasStation.address,
            "city_id": GasStation.city_id,
            "created_at": GasStation.created_at,
            "updated_at": GasStation.updated_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterStation:
    def filter_gas_stations(self, query: Query, **kwargs) -> Query:
        params = kwargs

        if name := params.get("name"):
            query = query.filter(GasStation.name.ilike(f"%{name}%"))
        if address := params.get("address"):
            query = query.filter(GasStation.address.ilike(f"%{address}%"))
        if city_id := params.get("city_id"):
            query = query.filter(GasStation.city_id == city_id)
        if state := params.get("state"):
            query = query.filter(GasStation.state.ilike(f"%{state}%"))
        if zip_code := params.get("zip_code"):
            query = query.filter(GasStation.zip_code == zip_code)
        if phone := params.get("phone"):
            query = query.filter(GasStation.phone.ilike(f"%{phone}%"))
        if email := params.get("email"):
            query = query.filter(GasStation.email.ilike(f"%{email}%"))
        if website := params.get("website"):
            query = query.filter(GasStation.website.ilike(f"%{website}%"))
        if notes := params.get("notes"):
            query = query.filter(GasStation.notes.ilike(f"%{notes}%"))

        return query
