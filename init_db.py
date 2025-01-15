# This file is useless. It is not used in the project. It is not imported anywhere. It is not referenced anywhere. It is not called anywhere. It is not tested anywhere. It is not used in any way. It can be deleted.
from sqlite3 import IntegrityError

from apps.config.db.conn import db_session
from apps.core.models import Organization


def init_data():
    organizations = ["SFDS"]
    with db_session() as db:
        try:
            for organization in organizations:
                obj = Organization(name=organization)
                db.add(obj)
            db.commit()
            print("Organizations are inserted successfully.")
        except IntegrityError as e:
            print(f"Exception: {str(e)}")


if __name__ == "__main__":
    init_data()
