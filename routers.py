from apps.apis.v1.accounts.payment_api_routes import router as payment_api_router
from apps.apis.v1.accounts.transaction_routes import router as transaction_router
from apps.apis.v1.appointment_schedule.appointment_schedule_routes import (
    router as appointment_schedule_router,
)
from apps.apis.v1.appointment_schedule_status.schedule_status_routes import (
    router as appointment_schedule_status_router,
)

# from apps.apis.v1.appointment.instructor_availability import (
#     router as instructor_availability_router,
# )
# from apps.apis.v1.appointment_status.status_routes import (
#     router as appointment_status_router,
# )
from apps.apis.v1.auth.routes import router as auth_router

# from apps.apis.v1.appointment.appointment_routes import router as appointment_router
from apps.apis.v1.availability.availability_routes import router as availability_router
from apps.apis.v1.day_off.day_off_routes import router as day_off_router
from apps.apis.v1.certificate.dmv_certificate_routes import router as certificate_router
from apps.apis.v1.certificate.user_certificate_routes import (
    router as user_certificate_router,
)
from apps.apis.v1.city.city_routes import router as city_router
from apps.apis.v1.coupon.coupon_routes import router as coupon_router
from apps.apis.v1.course.course import router as course_router
from apps.apis.v1.course.course_lesson import router as course_lesson_router
from apps.apis.v1.course.course_lesson_log import router as course_lesson_log_router
from apps.apis.v1.course.course_question import router as course_question_router
from apps.apis.v1.course.course_quiz import router as course_quiz_router
from apps.apis.v1.course.course_subunit import router as course_subunit_router
from apps.apis.v1.course.course_unit import router as course_unit_router
from apps.apis.v1.document.document_routes import router as document_router
from apps.apis.v1.driver_ed.driver_ed_lesson import router as driver_ed_lesson_router
from apps.apis.v1.driver_ed.driver_ed_lesson_log import router as driver_ed_lesson_log
from apps.apis.v1.driver_ed.driver_ed_optional.driver_ed_images import (
    router as driver_ed_images_router,
)
from apps.apis.v1.driver_ed.driver_ed_optional.driver_ed_optional_video import (
    router as driver_ed_optional_video_router,
)
from apps.apis.v1.driver_ed.driver_ed_question import (
    router as driver_ed_question_router,
)
from apps.apis.v1.driver_ed.driver_ed_quiz.driver_ed_quiz import (
    router as driver_ed_quiz_router,
)
from apps.apis.v1.driver_ed.driver_ed_quiz.driver_ed_quiz_log import (
    router as driver_ed_quiz_log,
)
from apps.apis.v1.driver_ed.driver_ed_section import router as driver_ed_section_router
from apps.apis.v1.driver_ed.driver_ed_unit import router as driver_ed_unit_router
from apps.apis.v1.driving_school.driving_school_routes import (
    router as driving_school_router,
)
from apps.apis.v1.dynamic.blog.blog_category_routes import (
    router as blog_category_router,
)
from apps.apis.v1.dynamic.blog.blog_routes import router as blog_router
from apps.apis.v1.dynamic.contact.contact_routes import router as contact_router
from apps.apis.v1.email.email_log_routes import router as email_log_router
from apps.apis.v1.email.email_routes import router as email_router
from apps.apis.v1.gas_station.gas_station_routes import router as gas_station_router

# from apps.apis.v1.instructor.instructor_routes import router as instructor_router
from apps.apis.v1.package.lesson_routes import router as lesson_router
from apps.apis.v1.package.package_category_routes import (
    router as package_category_router,
)
from apps.apis.v1.package.package_routes import router as package_router
from apps.apis.v1.pickup_location_type.pickup_location_type_routes import (
    router as pickup_location_type_router,
)
from apps.apis.v1.school.school_routes import router as school_router
from apps.apis.v1.training.training_log_routes import router as training_log_router
from apps.apis.v1.training.training_routes import router as training_router
from apps.apis.v1.users.instructor_notes import router as instructor_notes_router
from apps.apis.v1.users.profile_routes import router as profile_router
from apps.apis.v1.users.user_routes import router as user_router
from apps.apis.v1.vehicle.vehicle_routes import router as vehicle_router
from apps.apis.v1.cert.cert_routes import router as cert_router

routers = {
    "auth": auth_router,
    "profile": profile_router,
    "document": document_router,
    "email log": email_log_router,
    "dmv certificate": certificate_router,
    "user certificate": user_certificate_router,
    "cert": cert_router,
    "user": user_router,
    "instructor_notes": instructor_notes_router,
    "availability": availability_router,
    "Day Off": day_off_router,
    "appointment schedule": appointment_schedule_router,
    "appointment schedule status": appointment_schedule_status_router,
    "pickup location type": pickup_location_type_router,
    "payment api": payment_api_router,
    "account": transaction_router,
    "school": school_router,
    "driving school": driving_school_router,
    "package": package_router,
    "package_category": package_category_router,
    "lesson": lesson_router,
    "training": training_router,
    "training_logs": training_log_router,
    "vehicle": vehicle_router,
    "city": city_router,
    "gas station": gas_station_router,
    "coupon": coupon_router,
    "email templates": email_router,
    # Driver Ed from old project
    "driver_ed_unit": driver_ed_unit_router,
    "driver_ed_lesson": driver_ed_lesson_router,
    "driver_ed_lesson_log": driver_ed_lesson_log,
    "driver_ed_section": driver_ed_section_router,
    "driver_ed_question": driver_ed_question_router,
    "driver_ed_optional_video": driver_ed_optional_video_router,
    "driver_ed_images": driver_ed_images_router,
    "driver_ed_quiz": driver_ed_quiz_router,
    "driver_ed_quiz_log": driver_ed_quiz_log,
    # Dynamic Landing page routes
    "blog": blog_router,
    "blog category": blog_category_router,
    "contact": contact_router,
    # Learning Management System
    "course": course_router,
    "course unit": course_unit_router,
    "course subunit": course_subunit_router,
    "course lesson": course_lesson_router,
    "course lesson log": course_lesson_log_router,
    "course question": course_question_router,
    "course quiz": course_quiz_router,
}
