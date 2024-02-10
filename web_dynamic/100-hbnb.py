#!/usr/bin/python3
""" Starts a Flash Web Application """
import uuid
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template

app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """Remove the current SQLAlchemy Session"""
    storage.close()


@app.route("/100-hbnb/", strict_slashes=False)
def hbnb():
    """HBNB is alive!"""
    states = storage.all(State).values()
    amenities = storage.all(Amenity).values()

    return render_template(
        "100-hbnb.html",
        states=states,
        amenities=amenities,
        cache_id=str(uuid.uuid4()),
    )


if __name__ == "__main__":
    """Main Function"""
    port = environ.get("FLASK_PORT", 5000)
    host = environ.get("FLASK_HOST", "0.0.0.0")
    app.run(host=host, port=port)
