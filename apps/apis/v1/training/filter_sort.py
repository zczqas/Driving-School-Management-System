from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.training import Training, TrainingLogs


class SortTraining:
    def sorting_training_logs(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "created_at": TrainingLogs.created_at,
            "updated_at": TrainingLogs.updated_at,
            "user_id": TrainingLogs.user_id,
            "lesson_id": TrainingLogs.lesson_id,
            "training_id": TrainingLogs.training_id,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)

    def sorting_training(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "created_at": Training.created_at,
            "updated_at": Training.updated_at,
            "name": Training.name,
            "id": Training.id,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterTraining:
    def filter_training_logs(self, query: Query, **kwargs) -> Query:
        """Filter Training Logs

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if user_id := params.get("user_id"):
            query = query.filter(TrainingLogs.user_id == user_id)

        if lesson_id := params.get("lesson_id"):
            query = query.filter(TrainingLogs.lesson_id == lesson_id)

        if training_id := params.get("training_id"):
            query = query.filter(TrainingLogs.training_id == training_id)

        return query

    def filter_training(self, query: Query, **kwargs) -> Query:
        """Filter Training

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if id := params.get("id"):
            query = query.filter(Training.id == id)

        if name := params.get("name"):
            query = query.filter(Training.name.ilike(f"%{name}%"))

        return query
