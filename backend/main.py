from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import engine, SessionLocal
from models import Base, Student, Fee

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Tables
Base.metadata.create_all(bind=engine)


# ==========================
# Pydantic Schemas
# ==========================

class StudentCreate(BaseModel):
    name: str
    parent_name: str
    phone: str
    admission_date: str
    monthly_fee: int


class FeeCreate(BaseModel):
    student_id: int
    month: str
    amount: int
    status: str


class FeeUpdate(BaseModel):
    status: str


# ==========================
# Home
# ==========================

@app.get("/")
def home():
    return {"message": "Backend Running"}


# ==========================
# Student APIs
# ==========================

@app.post("/students")
def add_student(student: StudentCreate):

    db = SessionLocal()

    new_student = Student(
        name=student.name,
        parent_name=student.parent_name,
        phone=student.phone,
        admission_date=student.admission_date,
        monthly_fee=student.monthly_fee
    )

    db.add(new_student)
    db.commit()

    return {"message": "Student Added"}


@app.get("/students")
def get_students():

    db = SessionLocal()

    students = db.query(Student).all()

    return students


@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        return {"message": "Student Not Found"}

    db.delete(student)
    db.commit()

    return {"message": "Student Deleted"}


@app.put("/students/{student_id}")
def update_student(student_id: int, student: StudentCreate):

    db = SessionLocal()

    existing = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not existing:
        return {"message": "Student Not Found"}

    existing.name = student.name
    existing.parent_name = student.parent_name
    existing.phone = student.phone
    existing.admission_date = student.admission_date
    existing.monthly_fee = student.monthly_fee

    db.commit()

    return {"message": "Student Updated"}


# ==========================
# Fee APIs
# ==========================

@app.post("/fees")
def add_fee(fee: FeeCreate):

    db = SessionLocal()

    new_fee = Fee(
        student_id=fee.student_id,
        month=fee.month,
        amount=fee.amount,
        status=fee.status
    )

    db.add(new_fee)
    db.commit()

    return {"message": "Fee Added"}


@app.get("/fees")
def get_fees():

    db = SessionLocal()

    fees = db.query(Fee).all()

    return fees


@app.put("/fees/{fee_id}")
def update_fee(fee_id: int, fee: FeeUpdate):

    db = SessionLocal()

    existing = db.query(Fee).filter(Fee.id == fee_id).first()

    if not existing:
        return {"message": "Fee Not Found"}

    existing.status = fee.status
    db.commit()

    return {"message": "Fee Updated"}


# ==========================
# Dashboard API
# ==========================

@app.get("/dashboard")
def dashboard():

    db = SessionLocal()

    total_students = db.query(Student).count()

    paid_fees = db.query(Fee).filter(
        Fee.status == "Paid"
    ).count()

    pending_fees = db.query(Fee).filter(
        Fee.status == "Pending"
    ).count()

    fees = db.query(Fee).all()

    total_collected = 0
    total_pending_amount = 0

    for fee in fees:

        if fee.status == "Paid":
            total_collected += fee.amount

        elif fee.status == "Pending":
            total_pending_amount += fee.amount

    return {
        "total_students": total_students,
        "paid_fees": paid_fees,
        "pending_fees": pending_fees,
        "total_collected": total_collected,
        "total_pending_amount": total_pending_amount
    }