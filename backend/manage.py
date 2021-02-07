from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from app.controller import routes
from app import create_app, db

app = create_app()
app.register_blueprint(routes, url_prefix='/api/v1')

app.app_context().push()
manager = Manager(app)
migrate = Migrate(app, db, render_as_batch=True)
manager.add_command('db', MigrateCommand)


@manager.command
def run():
    app.run(debug=True)


@app.errorhandler(405)
def method_not_allowed(e):
    return {"mesaj": str(e)}, 405


@app.errorhandler(404)
def method_not_found(e):
    return {"mesaj": str(e)}, 404


if __name__ == '__main__':
    manager.run()
