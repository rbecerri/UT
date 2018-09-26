import numpy as np
import datetime as dt
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
#engine = create_engine("sqlite:///Resources/hawaii.sqlite")
engine = create_engine("sqlite:///Resources/hawaii.sqlite", connect_args={'check_same_thread': False}, echo=False)
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()
Measurement = Base.classes.measurement
Station = Base.classes.station
session = Session(engine)
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
#################################################
# Flask Routes
#################################################

#Method to convert string to date 
def str_date(sdate):
    return dt.datetime.strptime(sdate, "%Y-%m-%d").date()

#Method to create dictionaty based on 2 lists
def createdict(keys, values):
    int_dict = {}
    for idx, val in enumerate(keys):
        int_dict[val] = values[idx]
    return int_dict

#Method to calc minimum, average and max temperature for start/start-end dates
def cal_summary(start, end):
    results_query = []
    if not end:
        results_query = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
            filter(Measurement.date >= start).all()
    else:
        results_query = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
            filter(Measurement.date >= start).filter(Measurement.date <= end).all()
    return results_query

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<a href='http://127.0.0.1:5000/api/v1.0/precipitation'>api/v1.0/precipitation</a><br/>"
        f"<a href='http://127.0.0.1:5000/api/v1.0/stations'>api/v1.0/stations</a><br/>"
        f"<a href='http://127.0.0.1:5000/api/v1.0/tobs'>api/v1.0/tobs</a><br/>"
        f"<a href='http://127.0.0.1:5000/api/v1.0/2016-08-23'>api/v1.0/&lt;start_date&gt;</a><br/>"
        f"<a href='http://127.0.0.1:5000/api/v1.0/2012-02-28/2012-03-05'>api/v1.0/&lt;start_date&gt;/&lt;end_date&gt;</a>"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    results = []
    maxdatequery = session.query(func.max(Measurement.date)).first()[0]
    maxdate = str_date(maxdatequery)
    lastyear = maxdate - dt.timedelta(days=365)
    results_query = session.query(Measurement.date, Measurement.prcp.label("precipitation")).filter(Measurement.date >= lastyear).order_by(Measurement.date).all()
    #[results.append(createdict(["date", "precipitation"], [x.date, x.precipitation])) for x in results_query]
    [results.append(createdict([x.date], [x.precipitation])) for x in results_query]
    return jsonify(results)

@app.route("/api/v1.0/stations")
def stations():
    results = []
    results_query = session.query(Station.station, Station.name).all()
    [results.append(createdict(["station", "name"], [x.station, x.name])) for x in results_query] 
    return jsonify(results)

@app.route("/api/v1.0/tobs")
def tobs():
    results = []
    maxdatequery = session.query(func.max(Measurement.date)).first()[0]
    maxdate = str_date(maxdatequery)
    lastyear = maxdate - dt.timedelta(days=365)
    results_query = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date >= lastyear).all()
    [results.append(createdict(["date", "tobs"], [x.date, x.tobs])) for x in results_query]
    #[results.append(createdict(["tobs"], [x.tobs])) for x in results_query]
    #[results.append(x.tobs) for x in results_query]
    return jsonify(results)

@app.route("/api/v1.0/<start>")
@app.route("/api/v1.0/<start>/<end>")
def dates(start, end=None):
    results = []
    results_query = cal_summary(start, end)
    [results.append(createdict(["min", "avg", "max"], [x[0], x[1], x[2]])) for x in results_query] 
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
