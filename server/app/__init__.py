from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app():
    app = Flask(_name_)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Register routes
    from app.routes.routes import routes
    app.register_blueprint(routes)
    
    return app