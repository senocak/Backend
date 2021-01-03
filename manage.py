from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from app.controller.auth import auth
from app.controller.user import user
from app import create_app, db

app = create_app('dev')
app.register_blueprint(auth)
app.register_blueprint(user)

app.app_context().push()
manager = Manager(app)
migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)


@manager.command
def run():
    app.run(debug=True)


@app.errorhandler(405)
def method_not_allowed(e):
    return {"mesaj": "Method Geçersiz"}, 405


if __name__ == '__main__':
    manager.run()
