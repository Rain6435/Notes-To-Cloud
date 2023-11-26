from flask import Flask, request, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import mysql.connector
import hashlib
import time

UPLOAD_FOLDER = "./Users"
ALLOWED_EXTENSIONS = set(["png", "jpg", "jpeg"])

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"

CORS(app)

"""MySQL"""
mydb = mysql.connector.connect(
    user="root", password="", host="127.0.0.1", database="ntc"
)
cursor = mydb.cursor()


@app.route("/login", methods=["POST"])
def login():
    args = request.get_json()
    print(args)
    if "user" in args:  # type: ignore
        user = args["user"]  # type: ignore
        print(user)
        match user["type"]:
            case "manual":
                try:
                    cursor.execute(
                        """select * from customuser where email = %s AND password = %s""",
                        (user["email"], user["password"]),
                    )
                except:
                    print("Query error")
                    return "Not found", 404
                try:
                    result = cursor.fetchall()
                    if len(result) == 1:
                        print(result)
                        return "Success", 201
                    else:
                        print("404")
                        return "Not found", 404
                except:
                    print("Error fetching data.")
                    return "Not found", 404
            case "google":
                try:
                    cursor.execute(
                        """select * from googleuser where email = %s AND sub = %s""",
                        (user["email"], user["sub"]),
                    )
                except:
                    print("Query error")
                    return "Not found", 404
                try:
                    result = cursor.fetchall()
                    if len(result) == 1:
                        print(result)
                        return "Success", 201
                    else:
                        print("404")
                        return "Not found", 404
                except:
                    print("Error fetching data.")
                    return "Not found", 404


@app.route("/signin", methods=["POST"])
def signin():
    args = request.get_json()
    if "user" in args:
        user = args["user"]
        print(user)
        match user["type"]:
            case "manual":
                try:
                    try:
                        cursor.execute(
                            """select * from customuser where email = %s""",
                            (user["email"],),
                        )
                    except:
                        print("Error checking email")
                        return "Error checking email"
                    
                    result = cursor.fetchall()

                    if len(result) > 0:
                        return "Email Existing", 201
                    else:
                        password = hashlib.sha256(user["password"].encode())
                        query = """INSERT INTO customuser (firstName,lastName,UUID,email,age,addNum,addName,addZIP,phoneNum,sex,password) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
                        values = (
                            user["firstName"],
                            user["lastName"],
                            user["UUID"],
                            user["email"],
                            user["age"],
                            user["addNum"],
                            user["addName"],
                            user["addZIP"],
                            user["phoneNum"],
                            user["sex"],
                            password.hexdigest(),
                        )
                        try:
                            cursor.execute(query, values)
                            mydb.commit()
                            print(cursor.rowcount, "record inserted.")
                            return "Success", 200
                        except:
                            print("Error during insertion")
                            return "Error insertion", 404
                except:
                    print("Query error")
                    return "Not found", 404
            case "google":
                try:
                    cursor.execute(
                        """select * from googleuser where email = %s""",
                        (user["email"],),
                    )
                    result = cursor.fetchall()
                    if len(result) > 0:
                        return "Email Existing", 201
                    else:
                        query = """INSERT INTO googleuser (UUID,email,sub,given_name,family_name) VALUES (%s,%s,%s,%s,%s)"""
                        values = (
                            user["UUID"],
                            user["email"],
                            user["sub"],
                            user["given_name"],
                            user["family_name"],
                        )
                        try:
                            cursor.execute(query, values)
                            mydb.commit()
                            print(cursor.rowcount, "record inserted.")
                        except:
                            print("Error during insertion")
                            return "Error insertion", 404
                except:
                    print("Query error")
                    return "Not found", 404


@app.route("/upload", methods=["POST"])  # type: ignore
def upload():
    try:
        file = request.files["file"]
        filename = secure_filename(file.filename)  # type: ignore
        print(filename)
    except:
        print("Cannot insert file into specified directory")
    return "success"


"""try:
            try:
                
            except:
                
            result = cursor.fetchall()
            if len(result) != 0 and len(result) == 1:
                id = result[0][0]
                try:
                    os.listdir("Users/" + id)  # type: ignore
                except:
                    os.mkdir("Users/" + id)  # type: ignore
                    os.mkdir("Users/" + id + "/Images")  # type: ignore
                    os.mkdir("Users/" + id + "/Documents")  # type: ignore
                    os.mkdir("Users/" + id + "/Documents/PDF")  # type: ignore
                    os.mkdir("Users/" + id + "/Documents/TXT")  # type: ignore
                app.config["user"] = id
                return {"status": "success", "id": id}
            else:
                return {"status": "inexistent"}
        except:
            return {"status": "Error in manual user verification"}
    if "gUser" in args:  # type: ignore
        user = args["gUser"]  # type: ignore
        try:
            try:
                cursor.execute(
                    select * from guser where email = %s AND sub = %s,
                    (user["email"], user["sub"]),
                )
            except:
                return {"status": "Error in query or database for google user"}
            result = cursor.fetchall()
            if len(result) != 0 and len(result) == 1:
                id = result[0][0]
                try:
                    os.listdir("Users/" + id)  # type: ignore
                except:
                    os.mkdir("Users/" + id)  # type: ignore
                    os.mkdir("Users/" + id + "/Images")  # type: ignore
                    os.mkdir("Users/" + id + "/Documents")  # type: ignore
                    os.mkdir("Users/" + id + "/Documents/PDF")  # type: ignore
                    os.mkdir("Users/" + id + "/Documents/TXT")  # type: ignore
                app.config["user"] = id
                return {"status": "success", "id": id}
            else:
                try:
                    cursor.execute(
                        INSERT INTO guser (sub,email,given_name,family_name) VALUES (%s,%s,%s,%s,)
                        (
                            user["sub"],
                            user["email"],
                            user["given_name"],
                            user["family_name"],
                        ),
                    )
                    mydb.commit()
                except:
                    return {"status": "Error in insertion of google user to database"}
        except:
            return {"status": "Error in google user verification"}
    return {"status": "failure"}


@app.route("/signin", methods=["POST"])
def signin():
    args = request.get_json()
    user = args["user"]  # type: ignore
    try:
        try:
            cursor.execute(select * from muser where email = %s, (user["email"],))
        except:
            return {"status": "Error in query for email check"}
        result = cursor.fetchall()
        if len(result):
            return {"status": "existing"}
        else:
            try:
                password = hashlib.sha256(user["password"].encode())
                cursor.execute(
                    "INSERT INTO muser (id,firstName,lastName,email,age,addNum,addName,addZIP,phoneNum,sex,password) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                    (
                        user["id"],
                        user["firstName"],
                        user["lastName"],
                        user["email"],
                        user["age"],
                        user["addNum"],
                        user["addName"],
                        user["addZIP"],
                        user["phoneNum"],
                        user["sex"],
                        password.hexdigest(),
                    ),
                )
                mydb.commit()
            except:
                return {"status": "Error in insertion query of user"}
            os.mkdir("./Users/" + user["id"])
            os.mkdir("./Users/" + user["id"] + "/Images")
            os.mkdir("./Users/" + user["id"] + "/Documents")
            os.mkdir("./Users/" + user["id"] + "/Documents/PDF")
            os.mkdir("./Users/" + user["id"] + "/Documents/TXT")
            return {"status": "success"}
    except ValueError:
        return {"status": ValueError}


@app.route("/upload", methods=["POST"])  # type: ignore
def upload():
    try:
        file = request.files["file"]
        filename = secure_filename(file.filename)  # type: ignore
        file.save(os.path.join("Users//" + app.config.get("user") + "//Images//", filename))  # type: ignore
    except:
        print("Cannot insert file into specified directory")
    return "success"


@app.route("/getListFiles", methods=["POST"])
def getListFiles():
    args = request.get_json()
    user = args["id"]  # type: ignore
    try:
        files = os.listdir("./Users/" + user + "/Images")
        docs = os.listdir("./Users/" + user + "/Documents/PDF")
        files[:] = [i[: len(i) - 4] for i in files]
        docs[:] = [i[: len(i) - 4] for i in docs]
        joint = list(set(files).intersection(docs))
        diff = list(set(files) - set(docs))
        return {"files": [joint, diff]}
    except ValueError:
        os.mkdir("./Users/" + user + "/Images")
        print(ValueError)
    return {"status": "error"}


@app.route("/getPDF", methods=["POST"])
def getPDF():
    args = request.get_json()
    user = args["id"]
    file = args["file"]
    return send_file(
        "./Users/" + user + "/Documents/PDF/" + file[: len(file) - 4] + ".pdf",
        as_attachment=True,
        mimetype="application/pdf",
    )


@app.route("/getTXT", methods=["POST"])
def getTXT():
    args = request.get_json()
    user = args["id"]
    file = args["file"]
    return send_file(
        "./Users/" + user + "/Documents/TXT/" + file[: len(file) - 4] + ".txt",
        as_attachment=True,
        mimetype="text/plain",
    )


@app.route("/delete", methods=["POST"])
def delete():
    args = request.get_json()
    user = args["id"]
    file = args["file"]
    files = os.listdir("./Users/" + user + "/Images")
    result = filter(lambda x: x.startswith(file), files)
    result = list(result)
    os.remove("./Users/" + user + "/Documents/PDF/" + file + ".pdf")
    os.remove("./Users/" + user + "/Documents/txt/" + file + ".txt")
    time.sleep(1.0)
    os.remove("./Users/" + user + "/Images/" + result[0])
    return {"status": "success"}


@app.route("/logout", methods=["GET"])
def logout():
    app.config["user"] = ""
    return {"status": "success"}"""


if __name__ == "__main__":
    app.run()
