from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()


class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    parent_name = Column(String)

    phone = Column(String)

    admission_date = Column(String)

    monthly_fee = Column(Integer)


class Fee(Base):

    __tablename__ = "fees"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer)

    month = Column(String)

    amount = Column(Integer)

    status = Column(String)