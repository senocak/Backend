# Backend
    > cd backend
    > pip install pipenv
    > pipenv install
    // development
    > pipenv run python manage.py db init
    > pipenv run python manage.py db stamp head
    > pipenv run python manage.py db migrate
    > pipenv run python manage.py db upgrade
    // development
    > pipenv run python manage.py run

# Frontend
    > cd frontend
