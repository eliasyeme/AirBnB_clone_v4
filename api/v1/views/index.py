#!/usr/bin/python3
""" Index """
from models.amenity import Amenity
from models.city import City
from models.place import Place
from models.review import Review
from models.state import State
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import jsonify


@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """ Status of API """
    return jsonify({"status": "OK"})


@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def number_objects():
    """ Retrieves the number of each objects by type """
    classes = {"amenities": Amenity, "cities": City, "places": Place,
               "reviews": Review, "states": State, "users": User}

    num_objs = {}
    for class_name, class_ in classes.items():
        num_objs[class_name] = storage.count(class_)

    return jsonify(num_objs)
